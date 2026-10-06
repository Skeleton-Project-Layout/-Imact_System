package org.aeht.abhisaran.source;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.QuestionItem;
import org.aeht.abhisaran.repository.QuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/source")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionRepository questionRepository;

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionItem>> getQuestions(
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) Integer layer
    ) {
        List<QuestionItem> questions;
        if (sector != null && !sector.isBlank() && layer != null) {
            questions = questionRepository.findBySectorIdAndLayerOrderByQuestionNumberAsc(sector, layer);
        } else if (sector != null && !sector.isBlank()) {
            questions = questionRepository.findBySectorIdOrderByQuestionNumberAsc(sector);
        } else {
            questions = questionRepository.findAllByOrderBySectorIdAscQuestionNumberAsc();
        }
        return ResponseEntity.ok(questions);
    }
}
