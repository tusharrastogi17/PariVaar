package com.example.family.controller;

import com.example.family.dto.FamilyTreeResponse;
import com.example.family.model.Person;
import com.example.family.repository.PersonRepository;
import com.example.family.service.RelationshipResolverService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RestController
public class PersonController {

    private final PersonRepository personRepository;
    private final RelationshipResolverService relationshipResolverService;

    public PersonController(PersonRepository personRepository,
            RelationshipResolverService relationshipResolverService) {
        this.personRepository = personRepository;
        this.relationshipResolverService = relationshipResolverService;
    }

    @PostMapping("/person")
    public Person createPerson(@RequestBody Person person) {
        return personRepository.save(person);
    }

    @GetMapping("/hello")
    public String hello() {
        return "hello260510";
    }

    @GetMapping("/tree/{personId}")
    public FamilyTreeResponse getFamilyTree(@PathVariable Long personId) {
        return relationshipResolverService.getFamilyTree(personId);
    }
}
