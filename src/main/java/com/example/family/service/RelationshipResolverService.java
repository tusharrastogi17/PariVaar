package com.example.family.service;

import com.example.family.dto.RelationshipResolveResponse;
import com.example.family.exception.BusinessException;
import com.example.family.model.Gender;
import com.example.family.model.Person;
import com.example.family.model.RelationType;
import com.example.family.model.Relationship;
import com.example.family.repository.PersonRepository;
import com.example.family.repository.RelationshipRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class RelationshipResolverService {

    private static final String NOT_FOUND_MESSAGE = "Not able to find the relation";

    private final RelationshipRepository relationshipRepository;
    private final PersonRepository personRepository;

    public RelationshipResolverService(RelationshipRepository relationshipRepository,
            PersonRepository personRepository) {
        this.relationshipRepository = relationshipRepository;
        this.personRepository = personRepository;
    }

    public RelationshipResolveResponse resolve(String sourceId, String targetId, String userId) {
        if (sourceId == null || targetId == null) {
            throw new BusinessException(NOT_FOUND_MESSAGE);
        }

        if (sourceId.equals(targetId)) {
            // Depending on the DTO type, we might need to update it as well
            return new RelationshipResolveResponse(sourceId, targetId, "Self", List.of(), 0);
        }

        // Build graph scoped to this user's relationships only
        Map<String, List<Edge>> graph = buildGraph(relationshipRepository.findByUserId(userId));

        Deque<String> queue = new ArrayDeque<>();
        Map<String, Prev> prev = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(sourceId);
        visited.add(sourceId);

        while (!queue.isEmpty()) {
            String cur = queue.removeFirst();
            for (Edge e : graph.getOrDefault(cur, List.of())) {
                if (visited.contains(e.to()))
                    continue;

                visited.add(e.to());
                prev.put(e.to(), new Prev(cur, e.relation()));

                if (e.to().equals(targetId)) {
                    return buildResponse(sourceId, targetId, prev);
                }
                queue.addLast(e.to());
            }
        }

        throw new BusinessException(NOT_FOUND_MESSAGE);
    }


    private RelationshipResolveResponse buildResponse(String sourceId, String targetId, Map<String, Prev> prev) {
        List<RelationType> relPath = new ArrayList<>();
        String cur = targetId;

        while (prev.containsKey(cur)) {
            Prev p = prev.get(cur);
            relPath.add(p.via());
            cur = p.from();
        }
        Collections.reverse(relPath);

        List<String> pathStrings = relPath.stream()
                .map(r -> r.name().toUpperCase())
                .toList();

        int distance = relPath.size();
        String relationshipName = deriveRelationshipName(sourceId, targetId, relPath);

        return new RelationshipResolveResponse(sourceId, targetId, relationshipName, pathStrings, distance);
    }

    private String deriveRelationshipName(String sourceId, String targetId, List<RelationType> path) {
        if (path.isEmpty())
            return "Self";

        if (path.size() == 1) {
            return switch (path.get(0)) {
                case Parent -> {
                    Gender g = getGender(targetId);
                    yield g == Gender.M ? "Father" : g == Gender.F ? "Mother" : "Parent";
                }
                case Spouse -> {
                    Gender g = getGender(targetId);
                    yield g == Gender.M ? "Husband" : g == Gender.F ? "Wife" : "Spouse";
                }
                case Child -> "Child";
                default -> path.get(0).name();
            };
        }

        if (path.size() == 2 && isParent(path.get(0)) && isParent(path.get(1))) {
            return switch (getGender(sourceId)) {
                case M -> "Grandfather";
                case F -> "Grandmother";
                default -> "Grandparent";
            };
        }

        if (path.size() == 2 && path.get(0) == RelationType.Child && path.get(1) == RelationType.Child) {
            return switch (getGender(sourceId)) {
                case M -> "Grandson";
                case F -> "Granddaughter";
                default -> "Grandchild";
            };
        }

        if (path.size() == 2 && path.get(0) == RelationType.Child && isParent(path.get(1))) {
            return "Sibling";
        }

        return "Related";
    }

    private boolean isParent(RelationType r) {
        return r == RelationType.Parent;
    }

    private Gender getGender(String personId) {
        Optional<Gender> g = personRepository.findById(personId).map(p -> p.getGender());
        return g.orElse(null);
    }

    private Map<String, List<Edge>> buildGraph(List<Relationship> all) {
        Map<String, List<Edge>> g = new HashMap<>();

        for (Relationship r : all) {
            if (r.getSourcePersonId() == null || r.getTargetPersonId() == null || r.getRelation() == null)
                continue;

            String from = r.getSourcePersonId();
            String to = r.getTargetPersonId();
            RelationType rel = r.getRelation();

            g.computeIfAbsent(from, k -> new ArrayList<>()).add(new Edge(to, rel));

            // Add helpful inverse edges for better reachability.
            if (rel == RelationType.Parent) {
                g.computeIfAbsent(to, k -> new ArrayList<>()).add(new Edge(from, RelationType.Child));
            } else if (rel == RelationType.Spouse) {
                g.computeIfAbsent(to, k -> new ArrayList<>()).add(new Edge(from, RelationType.Spouse));
            }
        }
        System.out.println("Graph g: " + g);
        return g;

    }

    private record Edge(String to, RelationType relation) {
    }

    private record Prev(String from, RelationType via) {
    }
}
