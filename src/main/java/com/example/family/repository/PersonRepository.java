package com.example.family.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.family.model.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
}
