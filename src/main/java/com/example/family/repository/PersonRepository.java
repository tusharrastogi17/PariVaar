package com.example.family.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.family.model.Person;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    // Returns only the persons belonging to a specific user
    List<Person> findByUserId(String userId);

    // Used to verify a person belongs to the authenticated user before operations
    boolean existsByIdAndUserId(Long id, String userId);
}
