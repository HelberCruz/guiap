package com.IFSP.Prototipo.repository;

import com.IFSP.Prototipo.model.LocalRoteiro;
import com.IFSP.Prototipo.model.Roteiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalRoteiroRepository extends JpaRepository<LocalRoteiro, Long> {
    
    List<LocalRoteiro> findByRoteiro(Roteiro roteiro);
    List<LocalRoteiro> findByRoteiroOrderByOrdemVisitaAsc(Roteiro roteiro);
}