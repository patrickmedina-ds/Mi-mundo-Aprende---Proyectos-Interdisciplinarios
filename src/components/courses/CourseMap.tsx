import type { CSSProperties } from 'react';
import { ArrowRight, ChevronLeft, LockKeyhole, Sparkles } from 'lucide-react';
import type { Course } from '../../types/domain';

interface CourseMapProps {
  courses: Course[];
  onBack: () => void;
  onSelectCourse: (course: Course) => void;
}

export default function CourseMap({ courses, onBack, onSelectCourse }: CourseMapProps) {
  const active = courses.filter((course) => course.status === 'active');
  const soon = courses.filter((course) => course.status === 'soon');

  return (
    <main className="courses-page">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={18} /> Volver a mi mundo
      </button>
      <div className="courses-inner">
        <p className="eyebrow">Explora tu mundo</p>
        <h1>Mapa de cursos</h1>
        <p className="muted">Elige una zona para entrenar. Cada curso tiene sus propios temas.</p>

        <h3 className="courses-group-title"><Sparkles size={16} /> Disponibles ahora</h3>
        <div className="course-grid">
          {active.map((course) => {
            const topicCount = course.topics.length;
            const questionCount = course.topics.reduce((total, topic) => total + topic.questions.length, 0);
            return (
              <button
                key={course.id}
                className="course-card"
                style={{ '--c': course.color } as CSSProperties}
                onClick={() => onSelectCourse(course)}
              >
                <span className="course-card-icon">{course.icon}</span>
                <strong>{course.name}</strong>
                <small>{course.description}</small>
                <div className="course-card-meta">
                  <span>{topicCount} temas</span>
                  <span>·</span>
                  <span>{questionCount} retos</span>
                </div>
                <span className="course-card-go">Entrar <ArrowRight size={15} /></span>
              </button>
            );
          })}
        </div>

        {soon.length > 0 && (
          <>
            <h3 className="courses-group-title"><LockKeyhole size={15} /> Próximamente</h3>
            <div className="course-grid">
              {soon.map((course) => (
                <div
                  key={course.id}
                  className="course-card soon"
                  style={{ '--c': course.color } as CSSProperties}
                  aria-disabled="true"
                >
                  <span className="course-card-icon">{course.icon}</span>
                  <strong>{course.name}</strong>
                  <small>{course.description}</small>
                  <div className="course-card-meta">
                    <span>{course.topics.map((topic) => topic.name).join(' · ')}</span>
                  </div>
                  <span className="course-card-soon"><LockKeyhole size={13} /> Pronto</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
