package com.example.family.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.family.model.Relationship;
import com.example.family.repository.RelationshipRepository;

@RestController
public class RelationshipController {

    private final RelationshipRepository relationshipRepository;

    public RelationshipController(RelationshipRepository relationshipRepository) {
        this.relationshipRepository = relationshipRepository;
    }

    @PostMapping("/relationships")
    public Relationship createRelationship(@RequestBody Relationship relationship) {
        // Stamp the authenticated user's email as the owner of this relationship
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        relationship.setUserId(userId);
        return relationshipRepository.save(relationship);
    }
}
