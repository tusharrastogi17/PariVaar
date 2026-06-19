package com.example.family.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.family.dto.FamilyTreeResponse;
import com.example.family.model.Person;
import com.example.family.repository.PersonRepository;
import com.example.family.service.FamilyTreeService;

import java.util.List;

@RestController
public class PersonController {

    private final PersonRepository personRepository;
    private final FamilyTreeService familyTreeService;

    public PersonController(PersonRepository personRepository,
            FamilyTreeService familyTreeService) {
        this.personRepository = personRepository;
        this.familyTreeService = familyTreeService;
    }

    @GetMapping("/persons")
    public List<Person> listPersons() {
        return personRepository.findByUserId(getAuthenticatedUserId());
    }
    @PostMapping("/person")
    public Person createPerson(@RequestBody Person person) {
        person.setUserId(getAuthenticatedUserId());
        return personRepository.save(person);
    }


    @GetMapping("/tree/{personId}")
    public FamilyTreeResponse getFamilyTree(@PathVariable Long personId) {
        return familyTreeService.getFamilyTree(personId, getAuthenticatedUserId());
    }

    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user in security context");
        }
        return authentication.getPrincipal().toString();
    }
}
