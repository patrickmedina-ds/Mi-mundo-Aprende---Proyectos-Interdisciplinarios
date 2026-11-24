import type { CSSProperties } from 'react';
import { ArrowRight, ChevronLeft, Play } from 'lucide-react';
import type { Course, GradeLevel, Topic } from '../../types/domain';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onSelectTopic: (topic: Topic) => void;
}

const GRADES: GradeLevel[] = [3, 4, 5];

function TopicRow({
  topic,
  index,
  onSelectTopic,
}: {
  topic: Topic;
  index: number;
  onSelectTopic: (topic: Topic) => void;
}) {
  const count = topic.questions.length;
  const available = count > 0;
  return (
    <button
      className={`topic-row ${available ? '' : 'disabled'}`}
      onClick={() => available && onSelectTopic(topic)}
      disabled={!available}
    >
      <span className="topic-index">{index}</span>
      <div className="topic-copy">
        <strong>{topic.name}</strong>
        <span>{topic.description}</span>
        {topic.theory && <div className="topic-meta"><span className="topic-theory">📘 Con teoría</span></div>}
      </div>
      {available ? (
        <span className="topic-cta"><Play size={14} fill="currentColor" /> {count} retos</span>
      ) : (
        <span className="topic-cta soon">Pronto</span>
      )}
    </button>
  );
}

export default function CourseDetail({ course, onBack, onSelectTopic }: CourseDetailProps) {
  const hasPlayable = course.topics.some((topic) => topic.questions.length > 0);
  // Si el curso tiene temas en más de un grado, los agrupamos por grado.
  const gradesPresent = GRADES.filter((grade) => course.topics.some((topic) => topic.grade === grade));
  const grouped = gradesPresent.length > 1;
  let counter = 0;

  return (
    <main className="course-detail-page" style={{ '--c': course.color } as CSSProperties}>
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={18} /> Todos los cursos
      </button>
      <div className="courses-inner">
        <div className="course-detail-head">
          <span className="course-detail-icon">{course.icon}</span>
          <div>
            <p className="eyebrow">{course.area} · introducción al temario</p>
            <h1>{course.name}</h1>
            <p className="muted">{course.description}</p>
          </div>
        </div>

        {grouped ? (
          gradesPresent.map((grade) => (
            <div key={grade}>
              <h3 className="courses-group-title grade-title">
                <span className="grade-pill">{grade}.°</span> {grade}.° grado
              </h3>
              <div className="topic-list">
                {course.topics
                  .filter((topic) => topic.grade === grade)
                  .map((topic) => {
                    counter += 1;
                    return (
                      <TopicRow key={topic.id} topic={topic} index={counter} onSelectTopic={onSelectTopic} />
                    );
                  })}
              </div>
            </div>
          ))
        ) : (
          <>
            <h3 className="courses-group-title">Elige un tema</h3>
            <div className="topic-list">
              {course.topics.map((topic, idx) => (
                <TopicRow key={topic.id} topic={topic} index={idx + 1} onSelectTopic={onSelectTopic} />
              ))}
            </div>
          </>
        )}

        {hasPlayable && (
          <button
            className="primary-btn course-play-all"
            onClick={() => {
              const first = course.topics.find((topic) => topic.questions.length > 0);
              if (first) onSelectTopic(first);
            }}
          >
            Empezar por el primer tema <ArrowRight size={17} />
          </button>
        )}
      </div>
    </main>
  );
}
