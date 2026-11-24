import type { CSSProperties } from 'react';
import { ArrowRight, ChevronLeft, Lightbulb, Sparkles } from 'lucide-react';
import type { Course, Topic } from '../../types/domain';

interface LessonProps {
  course: Course;
  topic: Topic;
  onBack: () => void;
  onStart: () => void;
}

export default function Lesson({ course, topic, onBack, onStart }: LessonProps) {
  const theory = topic.theory;

  return (
    <main className="lesson-page" style={{ '--c': course.color } as CSSProperties}>
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={18} /> Volver al curso
      </button>
      <div className="courses-inner">
        <div className="lesson-head">
          <span className="lesson-badge">{course.icon} {course.name} · {topic.grade}.° grado</span>
          <p className="eyebrow">Aprende primero</p>
          <h1>{topic.name}</h1>
        </div>

        {theory ? (
          <>
            <p className="lesson-intro">{theory.intro}</p>

            <div className="lesson-blocks">
              {theory.blocks.map((block, index) => (
                <section className="lesson-block" key={index}>
                  <h3>{block.heading}</h3>
                  <p>{block.text}</p>
                </section>
              ))}
            </div>

            {theory.example && (
              <section className="lesson-example">
                <span className="lesson-tag"><Sparkles size={14} /> Ejemplo</span>
                <p className="lesson-example-problem">{theory.example.problem}</p>
                <p className="lesson-example-solution">{theory.example.solution}</p>
              </section>
            )}

            <section className="lesson-key">
              <span className="lesson-key-icon"><Lightbulb size={20} /></span>
              <div>
                <strong>Recuerda</strong>
                <p>{theory.keyIdea}</p>
              </div>
            </section>
          </>
        ) : (
          <p className="lesson-intro">Repasemos este tema practicando. ¡Tú puedes!</p>
        )}

        <button className="primary-btn lesson-cta" onClick={onStart}>
          ¡A practicar! <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}
