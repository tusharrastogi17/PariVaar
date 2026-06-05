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

    public FamilyTreeResponse getFamilyTree(Long rootPersonId) {
        if (rootPersonId == null || !personRepository.existsById(rootPersonId)) {
            throw new BusinessException("Person not found with id: " + rootPersonId);
        }

        // Build lookup maps
        List<Person> persons = personRepository.findAll();
        Map<Long, Person> personMap = persons.stream()
                .collect(Collectors.toMap(Person::getId, Function.identity()));

        List<Relationship> relations = relationshipRepository.findAll();

        // Pre-compute spouse map: sourceId -> targetId for Husband/Wife relations
        Map<Long, Long> spouseMap = new HashMap<>();
        for (Relationship r : relations) {
            if (r.getRelation() == RelationType.Husband || r.getRelation() == RelationType.Wife) {
                spouseMap.put(r.getSourcePersonId(), r.getTargetPersonId());
            }
        }

        // Pre-compute children map: parentId -> list of child ids (Father/Mother relations)
        Map<Long, List<Long>> childrenMap = new HashMap<>();
        for (Person p : persons) {
            childrenMap.putIfAbsent(p.getId(), new ArrayList<>());
        }
        for (Relationship r : relations) {
            if (r.getRelation() == RelationType.Father || r.getRelation() == RelationType.Mother) {
                List<Long> kids = childrenMap.get(r.getSourcePersonId());
                if (kids != null && !kids.contains(r.getTargetPersonId())) {
                    kids.add(r.getTargetPersonId());
                }
            }
        }

        return buildTree(rootPersonId, personMap, spouseMap, childrenMap);
    }

    private FamilyTreeResponse buildTree(Long personId,
            Map<Long, Person> personMap,
            Map<Long, Long> spouseMap,
            Map<Long, List<Long>> childrenMap) {

        Person person = personMap.get(personId);
        if (person == null) {
            return null;
        }

        FamilyTreeResponse node = new FamilyTreeResponse();
        node.setId(person.getId());
        node.setName(person.getName());

        // Set spouse name
        if (spouseMap.containsKey(personId)) {
            Person spouse = personMap.get(spouseMap.get(personId));
            if (spouse != null) {
                node.setSpouse(spouse.getName());
            }
        }

        // Recursively build children
        List<Long> childIds = childrenMap.getOrDefault(personId, List.of());
        for (Long childId : childIds) {
            FamilyTreeResponse childTree = buildTree(childId, personMap, spouseMap, childrenMap);
            if (childTree != null) {
                node.getChildren().add(childTree);
            }
        }

        return node;
    }
}
