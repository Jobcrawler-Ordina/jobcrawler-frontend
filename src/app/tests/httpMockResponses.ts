import { environment } from 'src/environments/environment';
import { Vacancy } from '../models/vacancy';

export const mockSkills = {
    _embedded: {
      skills: [
        {
            name: 'Angular',
            _links: {
                self: {
                    href: environment.api + '/skills/9afa709e-fcef-4303-97d5-a537467cad42'
                },
                skills: {
                    href: environment.api + '/skills'
                }
            }
        },
        {
            name: 'Java',
            _links: {
                self: {
                    href: environment.api + '/skills/fbdc0624-6c46-4be9-9797-d4bfbbdd1f04'
                },
                skills: {
                    href: environment.api + '/skills'
                }
            }
        }
      ]
    }
  };

export const mockVacancies = {
    vacancies: [
      {
        id: '1',
        vacancyURL: 'url',
        title: 'title 1',
        broker: 'Yacht',
        vacancyNumber: '1',
        hours: '40',
        location: 'Amsterdam, Nederland',
        salary: '1234',
        postingDate: '21 april 2020',
        about: 'vacancy 1',
        skills: []
      },
      {
        id: '2',
        vacancyURL: 'url',
        title: 'title 2',
        broker: 'Huxley',
        vacancyNumber: '2',
        hours: '40',
        location: 'Amsterdam, Nederland',
        salary: '2341',
        postingDate: '21 april 2020',
        about: 'vacancy 2',
        skills: []
      },
      {
        id: '3',
        vacancyURL: 'url',
        title: 'title 3',
        broker: 'Jobbird',
        vacancyNumber: '3',
        hours: '40',
        location: 'Amsterdam, Nederland',
        salary: '2143',
        postingDate: '21 april 2020',
        about: 'vacancy 3',
        skills: []
      }
    ]
  };

export const mockVacancy: Vacancy = {
    id: '0',
    title: 'Vacancy title',
    vacancyURL: 'google.com',
    broker: 'mockBroker',
    vacancyNumber: '123',
    hours: 40,
    location: 'Nieuwegein',
    postingDate: 'today',
    salaray: '',
    about: 'random',
    skills: []
};

export const noSkills = {
    _embedded: {
        skills: []
    }
  };

export const mockCities = ['Amsterdam', 'Den Haag', 'Rotterdam', 'Utrecht'];

export const newSkillMock = {
  name: 'skill',
  _links: {
    self: {
      href: environment.api + '/skills/9e6f7186-b466-458f-9e59-feacab86b91d'
    },
    skills: {
      href: environment.api + '/skills'
    }
  }
};
