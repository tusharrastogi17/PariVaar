package com.example.family.controller;

import com.example.family.model.Relationship;
import com.example.family.repository.RelationshipRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RelationshipController {

    private final RelationshipRepository relationshipRepository;

    public RelationshipController(RelationshipRepository relationshipRepository) {
        this.relationshipRepository = relationshipRepository;
    }

    @PostMapping("/relationships")
    public Relationship createRelationship(@RequestBody Relationship relationship) {
        return relationshipRepository.save(relationship);
    }
}
