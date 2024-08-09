package com.wecp.educationalresourcedistributionsystem.repository;


import com.wecp.educationalresourcedistributionsystem.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource,Long>{
    // extend jpa repostiory and add custom method if needed
}
