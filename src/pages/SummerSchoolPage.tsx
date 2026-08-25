import { useCallback, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CampusMap } from '../components/CampusMap'
import { Card } from '../components/Card'
import { FloatingCardPopover } from '../components/FloatingCardPopover'
import { SnlCourseLabel, type PopoverShowMode } from '../components/SnlCourseLabel'
import {
  courses,
  localize,
  notes,
  projects,
  schedule,
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
  const [activeCoursePopover, setActiveCoursePopover] = useState<{
    courseId: string
    anchor: HTMLElement
    pinned: boolean
  } | null>(null)
  const showCoursePopover = useCallback((
    courseId: string,
    anchor: HTMLElement,
    mode: PopoverShowMode,
  ) => {
    setActiveCoursePopover((current) => {
      if (mode === 'transient' && current?.courseId === courseId && current.pinned) return current
      if (mode === 'pinned' && current?.courseId === courseId && current.pinned) return null
      return { courseId, anchor, pinned: mode === 'pinned' }
    })
  }, [])
  const hideCoursePopover = useCallback((courseId: string, force = false) => {
    setActiveCoursePopover((current) => (
      current?.courseId === courseId && (force || !current.pinned) ? null : current
    ))
  }, [])
  const dismissCoursePopover = useCallback(() => setActiveCoursePopover(null), [])
  const activeCourse = activeCoursePopover
    ? courses.find((course) => course.id === activeCoursePopover.courseId) ?? null
    : null
  const courseForContent = (content: LocalizedText) => courses.find(
    (course) => course.title.zh === content.zh || course.title.en === content.en,
  )

  const renderScheduleContent = (content: LocalizedText) => {
    const course = courseForContent(content)
    return course ? (
      <SnlCourseLabel
        courseId={course.id}
        isOpen={activeCoursePopover?.courseId === course.id}
        label={l(course.title)}
        onHide={hideCoursePopover}
        onShow={showCoursePopover}
      />
    ) : l(content)
  }

  return (
    <div className="summer-school-page">
      <header className="summer-hero">
        <div className="summer-hero-copy">
          <span className="summer-hero-date">{t('summerSchool.dates')}</span>
          <h1>{t('summerSchool.title')}</h1>
          <p>{t('summerSchool.lead')}</p>
        </div>
      </header>

      <nav className="summer-page-nav summer-side-nav" aria-label={t('summerSchool.onThisPage')}>
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
        <div className="schedule-table-wrap">
          <table className="schedule-table" aria-label={t('summerSchool.schedule')}>
            <thead>
              <tr>
                <th>{t('summerSchool.scheduleDate')}</th>
                <th>{t('summerSchool.scheduleMorning')}</th>
                <th>{t('summerSchool.scheduleAfternoon')}</th>
                <th>{t('summerSchool.scheduleEvening')}</th>
                <th>{t('summerSchool.location')}</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((day) => {
                const slots = new Map(day.slots.map((slot) => [slot.time.zh, slot.content]))
                return (
                  <tr key={day.id}>
                    <th scope="row">{l(day.date)}</th>
                    {['上午 · 9:00–11:00', '下午 · 14:00–17:00', '晚间 · 19:00–21:00'].map((time) => (
                      <td key={time}>{slots.get(time) ? renderScheduleContent(slots.get(time)!) : '—'}</td>
                    ))}
                    <td>{l(day.location)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {activeCourse && activeCoursePopover ? (
          <FloatingCardPopover
            anchor={activeCoursePopover.anchor}
            contentKey={activeCourse.id}
            id="course-detail-popover"
            onDismiss={dismissCoursePopover}
            testId="course-popover"
          >
          <Card
            tone={activeCourse.tone}
            eyebrow={`${t('summerSchool.course')} ${activeCourse.code}`}
            title={l(activeCourse.title)}
            meta={<span>{t('summerSchool.speaker')} · {l(activeCourse.speaker)}</span>}
          >
            {activeCourse.topics.length > 0 ? (
              <ul className="topic-list">
                {activeCourse.topics.map((topic) => <li key={topic.zh}>{l(topic)}</li>)}
              </ul>
            ) : <p>{t('summerSchool.lectureNotice')}</p>}
          </Card>
          </FloatingCardPopover>
        ) : null}
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
          <CampusMap />
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
        <div className="course-grid card-list">
          {courses.map((course) => {
            const content = (
              <Card
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
                ) : <p>{t('summerSchool.lectureNotice')}</p>}
              </Card>
            )
            const label = `${t('summerSchool.course')} ${course.code} · ${l(course.title)}`

            const exportedLecturePath = course.id === 'course-1a'
              ? '/summer-school/2026/lectures/type-theory/'
              : course.id === 'course-1b'
                ? '/summer-school/2026/lectures/induction/'
                : course.id === 'course-2a'
                  ? '/summer-school/2026/lectures/curry-howard/'
                  : course.id === 'course-2b'
                    ? '/summer-school/2026/lectures/jixia-proof-exploration/'
                    : null

            return exportedLecturePath ? (
              <a
                key={course.id}
                className="card-link"
                href={exportedLecturePath}
                aria-label={label}
              >
                {content}
              </a>
            ) : (
              <Link
                key={course.id}
                className="card-link"
                to="/summer-school/2026/lectures/$lectureSlug"
                params={{ lectureSlug: course.slug }}
                aria-label={label}
              >
                {content}
              </Link>
            )
          })}
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
        <div className="project-grid card-list">
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
