import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { getPeople } from './api'
import './App.scss'
import { Loader } from './components/Loader'
import { Person } from './types/Person'

const PersonLink = ({ person }: { person?: Person }) => {
  if (!person) return <span>-</span>;
  return (
    <NavLink to={`/people/${person.slug}`} className={person.sex === 'f' ? 'has-text-danger' : ''}>
      {person.name}
    </NavLink>
  );
};

const HomePage = () => <h1 className="title">Home Page</h1>;

const PeoplePage = ({ people }: { people: Person[] }) => {
  const { slug } = useParams();
  return (
    <div>
      <h1 className="title">People Page</h1>
      {people.length === 0 ? (
        <Loader />
      ) : (
        <table className="table is-striped is-hoverable is-narrow is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Born</th>
              <th>Died</th>
              <th>Mother</th>
              <th>Father</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.slug} className={slug === person.slug ? 'has-background-warning' : ''}>
                <td>
                  <PersonLink person={person} />
                </td>
                <td>{person.sex}</td>
                <td>{person.born}</td>
                <td>{person.died}</td>
                <td>{person.mother ? <PersonLink person={person.mother} /> : '-'}</td>
                <td>{person.father ? <PersonLink person={person.father} /> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const NotFoundPage = () => <h1 className="title">Page not found</h1>;

export const App = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getPeople()
      .then(setPeople)
      .catch(setError);
  }, []);

  return (
    <>
      <div data-cy="app">
        <nav className="navbar is-fixed-top has-shadow" data-cy="nav">
          <div className="container">
            <div className="navbar-brand">
              <NavLink to="/" className={({ isActive }) => `navbar-item ${isActive ? 'has-background-grey-lighter' : ''}`}>Home</NavLink>
              <NavLink to="/people" className={({ isActive }) => `navbar-item ${isActive ? 'has-background-grey-lighter' : ''}`}>People</NavLink>
            </div>
          </div>
        </nav>

        <main className="section">
          <div className="container">
            {error && <p className="has-text-danger">Failed to load people.</p>}
            <Routes>
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/people" element={<PeoplePage people={people} />} />
              <Route path="/people/:slug" element={<PeoplePage people={people} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
};
