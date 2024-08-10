package com.wecp.educationalresourcedistributionsystem.repository;

import com.wecp.educationalresourcedistributionsystem.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByStudentId(Long studentId);
}