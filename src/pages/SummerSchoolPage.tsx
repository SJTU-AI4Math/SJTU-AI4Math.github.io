import { useTranslation } from 'react-i18next'
import { Card } from '../components/Card'
import {
  courses,
  localize,
  notes,
  projects,
  schedule,
  venueLabels,
  type LocalizedText,
} from './summerSchoolData'

function SectionHeading({
  index,
  title,
  description,
  id,
}: {
  index: string
  title: string
  description: string
  id: string
}) {
  return (
    <div className="summer-section-heading">
      <span className="summer-section-index" aria-hidden="true">{index}</span>
      <div>
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

export function SummerSchoolPage() {
  const { i18n, t } = useTranslation()
  const language = i18n.resolvedLanguage
  const l = (value: LocalizedText) => localize(value, language)

  return (
    <div className="summer-school-page">
      <header className="summer-hero">
        <div className="summer-hero-copy">
          <span className="summer-hero-date">{t('summerSchool.dates')}</span>
          <h1>{t('summerSchool.title')}</h1>
          <p>{t('summerSchool.lead')}</p>
        </div>
        <div className="summer-hero-metrics" aria-label={t('summerSchool.onThisPage')}>
          <span><strong>{schedule.length}</strong><small>{t('summerSchool.daysUnit')}</small></span>
          <span><strong>{courses.length}</strong><small>{t('summerSchool.coursesUnit')}</small></span>
          <span><strong>{projects.length}</strong><small>{t('summerSchool.projectsUnit')}</small></span>
        </div>
      </header>

      <nav className="summer-page-nav" aria-label={t('summerSchool.onThisPage')}>
        <a href="#schedule">{t('summerSchool.schedule')}</a>
        <a href="#courses">{t('summerSchool.coursesNav')}</a>
        <a href="#projects">{t('summerSchool.projects')}</a>
        <a href="#venue">{t('summerSchool.venueNav')}</a>
      </nav>

      <section id="schedule" className="summer-section" aria-labelledby="schedule-title">
        <SectionHeading
          index="01"
          id="schedule-title"
          title={t('summerSchool.schedule')}
          description={t('summerSchool.scheduleIntro')}
        />
        <div className="schedule-grid">
          {schedule.map((day, index) => (
            <Card
              key={day.id}
              className="schedule-card"
              tone={index < 2 ? 'violet' : index < 5 ? 'blue' : 'green'}
              eyebrow={`${t('summerSchool.day')} ${String(index + 1).padStart(2, '0')}`}
              title={l(day.date)}
              meta={<span className="location-label">{l(day.location)}</span>}
            >
              <div className="schedule-slots">
                {day.slots.map((item) => (
                  <div className="schedule-slot" key={`${day.id}-${l(item.time)}`}>
                    <time>{l(item.time)}</time>
                    <span>{l(item.content)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="venue" className="summer-section" aria-labelledby="venue-title">
        <SectionHeading
          index="02"
          id="venue-title"
          title={t('summerSchool.venue')}
          description={t('summerSchool.venueIntro')}
        />
        <Card
          className="venue-card"
          tone="green"
          eyebrow={t('summerSchool.location')}
          title={t('summerSchool.venue')}
          meta={(
            <a
              className="card-inline-link"
              href="https://map.sjtu.edu.cn/voxel#world"
              target="_blank"
              rel="noreferrer"
              aria-label={t('summerSchool.openMap')}
            >
              {t('summerSchool.openMap')} ↗
            </a>
          )}
        >
          <img
            className="campus-map"
            src="/img/SJTUmap.webp"
            width="1800"
            height="905"
            loading="lazy"
            decoding="async"
            alt={t('summerSchool.mapAlt')}
          />
          <div className="venue-pills">
            {venueLabels.map((venue) => <span key={venue.zh}>{l(venue)}</span>)}
          </div>
        </Card>
      </section>

      <section className="summer-section" aria-labelledby="notes-title">
        <SectionHeading
          index="03"
          id="notes-title"
          title={t('summerSchool.notes')}
          description={t('summerSchool.notesIntro')}
        />
        <Card tone="amber" eyebrow={t('summerSchool.info')} title={t('summerSchool.notes')}>
          <ol className="notice-list">
            {notes.map((note, index) => <li key={index}>{l(note)}</li>)}
          </ol>
        </Card>
      </section>

      <section id="courses" className="summer-section" aria-labelledby="courses-title">
        <SectionHeading
          index="04"
          id="courses-title"
          title={t('summerSchool.courses')}
          description={t('summerSchool.coursesIntro')}
        />
        <div className="course-grid">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="course-card"
              tone={course.tone}
              eyebrow={`${t('summerSchool.course')} ${course.code}`}
              title={l(course.title)}
              meta={<span>{t('summerSchool.speaker')} · {l(course.speaker)}</span>}
            >
              {course.topics.length > 0 ? (
                <ul className="topic-list">
                  {course.topics.map((topic) => <li key={topic.zh}>{l(topic)}</li>)}
                </ul>
              ) : null}
            </Card>
          ))}
        </div>
      </section>

      <section id="projects" className="summer-section" aria-labelledby="projects-title">
        <SectionHeading
          index="05"
          id="projects-title"
          title={t('summerSchool.projects')}
          description={t('summerSchool.projectsIntro')}
        />
        <p className="projects-vision">{t('summerSchool.projectsVision')}</p>
        <aside className="ai-policy">{t('summerSchool.aiPolicy')}</aside>
        <div className="project-grid">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="project-card"
              tone={project.tone}
              eyebrow={`${t('summerSchool.project')} · ${l(project.category)}`}
              title={l(project.title)}
            >
              <p>{l(project.description)}</p>
              {project.examples ? (
                <ul className="project-examples">
                  {project.examples.map((example) => <li key={example.zh}>{l(example)}</li>)}
                </ul>
              ) : null}
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
