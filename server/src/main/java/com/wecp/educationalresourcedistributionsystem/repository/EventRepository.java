package com.wecp.educationalresourcedistributionsystem.repository;

import com.wecp.educationalresourcedistributionsystem.entity.Event;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findAll(Sort sort);

}