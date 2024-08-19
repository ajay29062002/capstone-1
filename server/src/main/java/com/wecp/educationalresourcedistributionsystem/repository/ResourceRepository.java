package com.wecp.educationalresourcedistributionsystem.repository;

import com.wecp.educationalresourcedistributionsystem.entity.Resource;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findAll(Sort sort);

    List<Resource> findByAvailability(String string);

}