import { useState } from 'react';
import { lessons } from '../data/lessons';

function Lessons() {
  const [expandedId, setExpandedId] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [completedLessons, setCompletedLessons] = useState(
    JSON.parse(localStorage.getItem('completedLessonsList') || '[]')
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleQuizAnswer = (lessonId, quizIndex, answerIndex) => {
    const key = `${lessonId}-${quizIndex}`;
    setQuizAnswers({ ...quizAnswers, [key]: answerIndex });
    
    const lesson = lessons.find(l => l.id === lessonId);
    const correct = lesson.quiz[quizIndex].answer === answerIndex;
    setQuizResults({ ...quizResults, [key]: correct });
  };

  const markComplete = (id) => {
    if (!completedLessons.includes(id)) {
      const newCompleted = [...completedLessons, id];
      setCompletedLessons(newCompleted);
      localStorage.setItem('completedLessonsList', JSON.stringify(newCompleted));
      localStorage.setItem('completedLessons', newCompleted.length.toString());
    }
  };

  const allQuizAnswered = (lesson) => {
    return lesson.quiz.every((_, i) => quizAnswers[`${lesson.id}-${i}`] !== undefined);
  };

  const allCorrect = (lesson) => {
    return lesson.quiz.every((q, i) => quizResults[`${lesson.id}-${i}`] === true);
  };

  return (
    <div className="min-h-screen bg-bg p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">學習中心</h1>
        <p className="text-text-secondary text-sm">第一階段：基礎概念</p>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isExpanded = expandedId === lesson.id;
          const isCompleted = completedLessons.includes(lesson.id);
          
          return (
            <div 
              key={lesson.id}
              className={`bg-bg-secondary rounded-2xl border transition-all overflow-hidden ${
                isCompleted ? 'border-profit/30' : 'border-white/5'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(lesson.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                    isCompleted 
                      ? 'bg-profit/20 text-profit' 
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {isCompleted ? '✓' : lesson.id}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{lesson.title}</h3>
                    <p className="text-text-secondary text-xs">
                      {isCompleted ? '已完成' : '未開始'}
                    </p>
                  </div>
                </div>
                <span className={`text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4">
                  {/* Content */}
                  <div className="text-text-secondary text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {lesson.content}
                  </div>

                  {/* Terms */}
                  <div className="mb-4">
                    <h4 className="text-white text-xs font-semibold mb-2">📖 關鍵術語</h4>
                    <div className="space-y-2">
                      {lesson.terms.map((term, i) => (
                        <div key={i} className="text-xs text-text-secondary bg-white/5 rounded-lg p-2">
                          {term}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quiz */}
                  <div className="mb-4">
                    <h4 className="text-white text-xs font-semibold mb-2">📝 課後測驗</h4>
                    <div className="space-y-3">
                      {lesson.quiz.map((q, qi) => {
                        const answerKey = `${lesson.id}-${qi}`;
                        const selectedAnswer = quizAnswers[answerKey];
                        const result = quizResults[answerKey];
                        
                        return (
                          <div key={qi} className="bg-white/5 rounded-xl p-3">
                            <p className="text-white text-xs mb-2">{q.q}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, oi) => {
                                let btnClass = 'bg-bg-secondary text-text-secondary text-xs py-2 px-3 rounded-lg border border-white/10';
                                
                                if (selectedAnswer !== undefined) {
                                  if (oi === q.answer) {
                                    btnClass = 'bg-profit/20 text-profit text-xs py-2 px-3 rounded-lg border border-profit/50';
                                  } else if (oi === selectedAnswer && !result) {
                                    btnClass = 'bg-loss/20 text-loss text-xs py-2 px-3 rounded-lg border border-loss/50';
                                  } else {
                                    btnClass = 'bg-bg-secondary/50 text-text-secondary/50 text-xs py-2 px-3 rounded-lg border border-white/5';
                                  }
                                } else {
                                  btnClass = 'bg-bg-secondary text-text-secondary text-xs py-2 px-3 rounded-lg border border-white/10 hover:border-accent/50 cursor-pointer transition-all';
                                }
                                
                                return (
                                  <button
                                    key={oi}
                                    onClick={() => handleQuizAnswer(lesson.id, qi, oi)}
                                    className={btnClass}
                                    disabled={selectedAnswer !== undefined}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mark Complete Button */}
                  {allQuizAnswered(lesson) && (
                    <button
                      onClick={() => markComplete(lesson.id)}
                      disabled={isCompleted}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                        isCompleted
                          ? 'bg-profit/20 text-profit cursor-default'
                          : allCorrect(lesson)
                            ? 'bg-accent text-white hover:bg-accent/80'
                            : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {isCompleted 
                        ? '✓ 已完成' 
                        : allCorrect(lesson)
                          ? '完成課堂'
                          : '答對所有題目以完成'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Lessons;
