import * as React from 'react';
import { Author } from '../../../domain/models';
import { getAuthorImgSrc } from '../../../utils/urls';

import './CourseAuthorsCard.css';


interface CourseAuthorsCardProps {
  authors: Author[];
}

export const CourseAuthorsCard: React.StatelessComponent<
  CourseAuthorsCardProps
> = (props: CourseAuthorsCardProps) => {
  const authors = props.authors;

  const authorCardTitle = authors.length > 1 ? 'Authors' : 'Author';

  const authorsHtml = authors.map(a => {
    //const authorImgSrc = `/img/authors/${a.picture}`;
    const authorImgSrc = getAuthorImgSrc(a.picture, 100);

    return (
      <div key={a.id} className="course-author-block">
        <div className="course-author-name-block">
          <div>
            <h3>{a.name}</h3>
            <h4>{a.title}</h4>
          </div>
          <div>
            <img alt={a.name} src={authorImgSrc} title={a.name} />
          </div>
        </div>

        <p className="card-bio">{a.bio}</p>
      </div>
    );
  });

  return (
    <div className="course-author-card-container">
      <p className="card-label">{authorCardTitle}</p>
      {authorsHtml}
    </div>
  );
};
