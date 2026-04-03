package com.example.family.controller;

import com.example.family.model.Person;
import com.example.family.repository.PersonRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonController {

    private final PersonRepository personRepository;

    public PersonController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @PostMapping("/person")
    public Person createPerson(@RequestBody Person person) {
        return personRepository.save(person);
    }

    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }
}

