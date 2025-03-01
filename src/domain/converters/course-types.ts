import { defaultArray } from '../core';
import {
  CoursesJsonEdge,
  CoursesJson,
  CoursesJsonDescriptionHtmlSections,
  PreviewsJsonLessonPreviews,
  PreviewsJsonCoursePreviews
} from '../graphql-types';

import { productFromCoursesJsonProducts } from './product-types';
import { chapterFromChapter_2 } from './chapter-types';
import {
  Course,
  asCourseLevel,
  Author,
  asCourseFlavorType,
  DescriptionHtmlSection
} from '../models';
import { publishingScheduleItemFromPublishingSchdule_2 } from './publishing-schedule-types';

export function courseFromCoursesJsonEdge(
  edge: CoursesJsonEdge,
  authors: Author[]
): Course {
  const c = edge.node;
  return coursefromCoursesJson(c, authors);
}

export function coursefromCoursesJson(
  c: CoursesJson,
  authors: Author[],
  coursePreviews?: PreviewsJsonCoursePreviews[],
  lessonPreviews?: PreviewsJsonLessonPreviews[]
): Course {
  let prev = undefined;
  if (coursePreviews) {
    prev = coursePreviews.find(p => p.courseId === c.id);
  }

  const course: Course = {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    descriptionHtmlSections: defaultArray(c.descriptionHtmlSections).map(
      descriptionHtmlSectionFromDescriptionHtmlSection_2
    ),
    notes: c.notes,
    level: asCourseLevel(c.level),
    url: c.url,
    label: c.label,
    launchdate: new Date(c.launchdate),
    authors: getAuthorsByAuthorIds(authors, c.authors),
    publishedChapters: c.publishedChapters,
    publishingScheduleItems: defaultArray(c.publishingSchedule).map((si, idx) =>
      publishingScheduleItemFromPublishingSchdule_2(si)
    ),
    chapters: defaultArray(c.chapters).map((c, idx) =>
      chapterFromChapter_2(c, idx, lessonPreviews)
    ),
    flavors: defaultArray(c.flavors).map(asCourseFlavorType),
    products: defaultArray(c.products).map(productFromCoursesJsonProducts),
    previewVideoId: prev?.videoId
  };

  numberCourseLessons(course);

  return course;
}

function getAuthorsByAuthorIds(authors: Author[], ids: string[]) {
  return authors.filter(a => ids.includes(a.id));
}

function numberCourseLessons(course: Course): void {
  let lessonCount = 0;
  for (var i1 = 0; i1 < course.chapters.length; i1++) {
    for (var j1 = 0; j1 < course.chapters[i1].lessons.length; j1++) {
      lessonCount++;
      course.chapters[i1].lessons[j1].lessonNumber = lessonCount;
    }
  }
}

export function descriptionHtmlSectionFromDescriptionHtmlSection_2(
  s: CoursesJsonDescriptionHtmlSections
): DescriptionHtmlSection {
  return {
    title: s.title,
    descriptionHtml: s.descriptionHtml
  };
}
