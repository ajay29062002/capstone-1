package com.wecp.educationalresourcedistributionsystem.service;

import com.wecp.educationalresourcedistributionsystem.entity.Event;
import com.wecp.educationalresourcedistributionsystem.entity.EventRegistration;
import com.wecp.educationalresourcedistributionsystem.repository.EventRepository;
import com.wecp.educationalresourcedistributionsystem.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class RegistrationService {
    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    public EventRegistration registerForEvent(Long eventId, EventRegistration registration) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        boolean alreadyRegistered = registrationRepository.existsByEventIdAndStudentId(eventId,
                registration.getStudentId());

        if (alreadyRegistered) {
            throw new IllegalStateException("Student is already registered for this event");
        }

        registration.setEvent(event);
        return registrationRepository.save(registration);
    }

    public List<EventRegistration> getRegistrationsByStudentId(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }

    public List<EventRegistration> getAllEventRegistrations() {
        return registrationRepository.findAll();
    }

}