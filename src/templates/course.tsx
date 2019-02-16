import * as React from 'react';
import { graphql } from 'gatsby';

import { Helmet } from 'react-helmet';

import {
  CoursesJson,
  AuthorsJsonConnection,
  CoursesJsonConnection,
  BundlesJsonConnection,
  TestimonialsJsonConnection
} from '../domain/graphql-types';

import { BreadCrumbs } from '../components/shared/BreadCrumbs/BreadCrumbs';
import { Course, Bundle } from '../domain/models';
import {
  authorFromAuthorsJsonEdge,
  courseFromCoursesJsonEdge,
  coursefromCoursesJson,
  testimonialFromTestimonialJsonEdge
} from '../domain/converters';
import { bundleFromBundlesJsonEdge } from '../domain/converters/bundle-types';

import SignUpSection from '../components/shared/SignUpSection/SignUpSection';
import { CourseBanner } from '../components/courseDetails/CourseBanner/CourseBanner';

import { CourseMetaCard } from '../components/courseDetails/CourseMetaCard/CourseMetaCard';

import { CoursePurchaseArea } from '../components/courseDetails/CoursePurchaseArea/CoursePurchaseArea';
import BundleSection from '../components/home/BundleSection/BundleSection';
import { CourseCurriculum } from '../components/courseDetails/CourseCurriculum/CourseCurriculum';

import '../css/course-details.css';
import Testimonials from '../components/Testimonials/Testimonials';
import CountdownTimer from '../components/shared/CountdownTimer/CountdownTimer';
import { MainLayout } from '../layouts/MainLayout';
import { Seo } from '../components/shared/Seo/Seo';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema

interface CourseTemplateProps {
  data: {
    authorsConnection: AuthorsJsonConnection;
    coursesConnection: CoursesJsonConnection;
    bundlesConnection: BundlesJsonConnection;
    testimonialsConnection: TestimonialsJsonConnection;
    courseConnection: CoursesJson;
  };
}

interface CourseTemplateState {
  course: Course;
  bundles: Bundle[];
}

class CourseTemplate extends React.Component<
  CourseTemplateProps,
  CourseTemplateState
> {
  constructor(props: CourseTemplateProps) {
    super(props);

    const authors = this.props.data.authorsConnection.edges.map(
      authorFromAuthorsJsonEdge
    );

    const courses = this.props.data.coursesConnection.edges.map(c =>
      courseFromCoursesJsonEdge(c, authors)
    );

    this.state = {
      course: coursefromCoursesJson(this.props.data.courseConnection, authors),
      bundles: this.props.data.bundlesConnection.edges.map(b =>
        bundleFromBundlesJsonEdge(b, courses)
      )
    };
  }

  private getNotesHtml(notes: string[]): JSX.Element {
    if (!notes || (notes && notes.length === 0)) {
      return null;
    }
    const notesHtml = notes.map((note, idx) => {
      return (
        <li key={idx}>
          <span>{note}</span>
        </li>
      );
    });
    return <ul>{notesHtml}</ul>;
  }

  public render() {
    const course = this.state.course;
    const title = this.props.data.courseConnection.title;
    const breadCrumbs = [
      { name: 'All courses', url: '/' },
      { name: 'Course details', url: '' }
    ];

    let notesHeader = null;
    const notesHtml = this.getNotesHtml(course.notes);
    if (notesHtml !== null) {
      notesHeader = <h2>Notes</h2>;
    }

    const testimonials = this.props.data.testimonialsConnection.edges.map(
      testimonialFromTestimonialJsonEdge
    );

    const pageTitle = `${course.title} | NativeScripting`;

    let descHtml = (
      <div>
        <h2>What you'll learn</h2>
        <p>{course.description}</p>
      </div>
    );

    if (
      course.descriptionHtmlSections &&
      course.descriptionHtmlSections.length > 0
    ) {
      const descSections = course.descriptionHtmlSections.map((s, i) => {
        return (
          <div key={i}>
            <h2>{s.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: s.descriptionHtml }} />
          </div>
        );
      });
      descHtml = <div>{descSections}</div>;
    }

    return (
      <MainLayout>
        <Seo course={course} courseSeo />
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>

        <CountdownTimer />

        <div className="wrapper">
          <div className="course-details-container">
            <div className="breadcrumb-wrapper">
              <BreadCrumbs breadcrumbs={breadCrumbs} />
            </div>

            <CourseBanner course={course} />

            <div className="course-details-wrapper">
              <div className="course-details-pane">
                <CourseMetaCard course={course} />
              </div>

              <div className="course-details-pane">
                <CoursePurchaseArea course={course} />
              </div>
            </div>

            <div className="course-description-wrapper">
              {descHtml}

              {notesHeader}
              {notesHtml}
            </div>

            <CourseCurriculum course={course} />

            <Testimonials testimonials={testimonials} />

            <BundleSection bundles={this.state.bundles} />

            <SignUpSection />
          </div>
        </div>
      </MainLayout>
    );
  }
}

export const coursePageQuery = graphql`
  query CoursePageQuery($courseUrl: String) {
    #get authors
    authorsConnection: allAuthorsJson(filter: { types: { in: "course" } }) {
      totalCount
      edges {
        node {
          id
          title
          name
          picture
          bio
          biolong
          twitter
          github
        }
      }
    }

    #get courses
    coursesConnection: allCoursesJson {
      totalCount
      edges {
        node {
          id
          title
          flavors
          url
          label
          authors
          level
          products {
            id
            name
            description
            licensesMin
            licensesMax
            pricereg
            pricesale
          }
        }
      }
    }

    #get bundles
    bundlesConnection: allBundlesJson {
      edges {
        node {
          id
          title
          subtitle
          description
          url
          promototal
          promoremaining
          courseIds
          bundleLevel
          products {
            id
            name
            description
            pricesale
            pricereg
            licensesMin
            licensesMax
          }
        }
      }
    }

    #get testimonials
    testimonialsConnection: allTestimonialsJson {
      totalCount
      edges {
        node {
          id
          name
          img
          twitter
          order
          quoteHtml
          titleHtml
        }
      }
    }

    #get current course
    courseConnection: coursesJson(url: { eq: $courseUrl }) {
      id
      title
      subtitle
      description
      descriptionHtmlSections {
        title
        descriptionHtml
      }
      notes
      url
      flavors
      level
      label
      launchdate
      authors
      publishedChapters
      publishingSchedule {
        id
        date
      }
      products {
        id
        name
        description
        licensesMin
        licensesMax
        pricereg
        pricesale
      }

      chapters {
        id
        name
        lessons {
          chapterId
          id
          name
          isPreview
        }
      }
    }
  }
`;

export default CourseTemplate;
