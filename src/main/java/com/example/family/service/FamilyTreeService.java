package com.example.family.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.family.dto.FamilyTreeResponse;
import com.example.family.exception.BusinessException;
import com.example.family.model.Person;
import com.example.family.model.RelationType;
import com.example.family.model.Relationship;
import com.example.family.repository.PersonRepository;
import com.example.family.repository.RelationshipRepository;

@Service
public class FamilyTreeService {

    private final PersonRepository personRepository;
    private final RelationshipRepository relationshipRepository;

    public FamilyTreeService(PersonRepository personRepository,
            RelationshipRepository relationshipRepository) {
        this.personRepository = personRepository;
        this.relationshipRepository = relationshipRepository;
    }

    /**
     * Builds the family tree rooted at rootPersonId, scoped to userId.
     * Only persons and relationships owned by this user are included.
     */
    public FamilyTreeResponse getFamilyTree(String rootPersonId, String userId) {
        // Verify the requested root person actually belongs to this user
        if (rootPersonId == null || !personRepository.existsByIdAndUserId(rootPersonId, userId)) {
            throw new BusinessException("Person not found with id: " + rootPersonId);
        }

        // Build lookup maps — scoped to this user only
        List<Person> persons = personRepository.findByUserId(userId);
        Map<String, Person> personMap = persons.stream()
                .collect(Collectors.toMap(Person::getId, Function.identity()));

        List<Relationship> relations = relationshipRepository.findByUserId(userId);

        // Pre-compute spouse map: sourceId -> targetId for Spouse relations
        Map<String, String> spouseMap = new HashMap<>();
        for (Relationship r : relations) {
            if (r.getRelation() == RelationType.Spouse) {
                spouseMap.put(r.getSourcePersonId(), r.getTargetPersonId());
                spouseMap.put(r.getTargetPersonId(), r.getSourcePersonId()); // Bidirectional
            }
        }

        // Pre-compute children map: parentId -> list of child ids (Parent relations)
        Map<String, List<String>> childrenMap = new HashMap<>();
        for (Person p : persons) {
            childrenMap.putIfAbsent(p.getId(), new ArrayList<>());
        }
        for (Relationship r : relations) {
            if (r.getRelation() == RelationType.Parent) {
                List<String> kids = childrenMap.get(r.getSourcePersonId());
                if (kids != null && !kids.contains(r.getTargetPersonId())) {
                    kids.add(r.getTargetPersonId());
                }
            } else if (r.getRelation() == RelationType.Child) {
                // If it's a Child relation, the Target is the Parent!
                List<String> kids = childrenMap.get(r.getTargetPersonId());
                if (kids != null && !kids.contains(r.getSourcePersonId())) {
                    kids.add(r.getSourcePersonId());
                }
            }
        }

        return buildTree(rootPersonId, personMap, spouseMap, childrenMap, new java.util.HashSet<>());
    }

    private FamilyTreeResponse buildTree(String personId,
            Map<String, Person> personMap,
            Map<String, String> spouseMap,
            Map<String, List<String>> childrenMap,
            java.util.Set<String> visited) {

        if (visited.contains(personId)) {
            return null; // Break cycle
        }
        visited.add(personId);

        Person person = personMap.get(personId);
        if (person == null) {
            return null;
        }

        FamilyTreeResponse node = new FamilyTreeResponse();
        node.setId(person.getId());
        node.setName(person.getName());
        node.setGender(person.getGender() != null ? person.getGender().name() : null);

        // Set spouse details
        String spouseId = spouseMap.get(personId);
        if (spouseId != null) {
            Person spouse = personMap.get(spouseId);
            if (spouse != null) {
                node.setSpouse(spouse.getName());
                node.setSpouseId(spouse.getId());
                node.setSpouseGender(spouse.getGender() != null ? spouse.getGender().name() : null);
                visited.add(spouseId); // Prevent traversing back through spouse if not needed
            }
        }

        // Combine children of this person AND their spouse
        List<String> childIds = new ArrayList<>(childrenMap.getOrDefault(personId, List.of()));
        if (spouseId != null) {
            List<String> spouseChildIds = childrenMap.getOrDefault(spouseId, List.of());
            for (String scId : spouseChildIds) {
                if (!childIds.contains(scId)) {
                    childIds.add(scId);
                }
            }
        }

        // Recursively build children
        for (String childId : childIds) {
            FamilyTreeResponse childTree = buildTree(childId, personMap, spouseMap, childrenMap, visited);
            if (childTree != null) {
                node.getChildren().add(childTree);
            }
        }

        return node;
    }
}
