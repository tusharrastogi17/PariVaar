package com.example.family.repository;

import com.example.family.model.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {

    // Returns only the relationships belonging to a specific user
    List<Relationship> findByUserId(String userId);
}

