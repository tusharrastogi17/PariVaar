package com.example.family.dto;

import com.example.family.model.Person;
import com.example.family.model.Relationship;

import java.util.List;

public class FamilyTreeResponse {
    private List<Person> persons;
    private List<Relationship> relationships;

    public FamilyTreeResponse() {
    }

    public FamilyTreeResponse(List<Person> persons, List<Relationship> relationships) {
        this.persons = persons;
        this.relationships = relationships;
    }

    public List<Person> getPersons() {
        return persons;
    }

    public void setPersons(List<Person> persons) {
        this.persons = persons;
    }

    public List<Relationship> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<Relationship> relationships) {
        this.relationships = relationships;
    }
}
