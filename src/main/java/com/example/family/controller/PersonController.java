package com.example.family.controller;

import java.util.List;

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

@RestController
public class PersonController {

    private final PersonRepository personRepository;
    private final FamilyTreeService familyTreeService;

    public PersonController(PersonRepository personRepository,
            FamilyTreeService familyTreeService) {
        this.personRepository = personRepository;
        this.familyTreeService = familyTreeService;
    }

    // -created to add new person in the tree/person table 
    @PostMapping("/person")
    public Person createPerson(@RequestBody Person person) {
        person.setUserId(getAuthenticatedUserId());

        // Generate custom ID (Up to first 5 letters of name + current date timestamp + 4-digit random sequence)
        String nameStr = person.getName() != null ? person.getName().trim().replaceAll("\\s+", "") : "XXXXX";
        if (nameStr.isEmpty()) nameStr = "XXXXX";
        String prefix = nameStr.length() > 5 ? nameStr.substring(0, 5).toUpperCase() : nameStr.toUpperCase();
        String timestamp = new java.text.SimpleDateFormat("yyyyMMdd").format(new java.util.Date());
        String uniqueSeq = String.format("%04d", new java.util.Random().nextInt(10000));
        person.setId(prefix + timestamp + uniqueSeq);

        return personRepository.save(person);
    }

    @GetMapping("/persons")
    public List<Person> listPersons() {
        return personRepository.findByUserId(getAuthenticatedUserId());
    }

    @GetMapping("/tree/{personId}")
    public FamilyTreeResponse getFamilyTree(@PathVariable String personId) {
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
