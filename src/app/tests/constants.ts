export const mockSkills = {
    _embedded: {
      skills: [
        {
            name: "Angular"
        },
        {
            name: "Java"
        }
      ]
    }
  };

export const mockVacancies = {
    vacancies: [
      {
        id: "1",
        vacancyURL: "url",
        title: "title 1",
        broker: "Yacht",
        vacancyNumber: "1",
        hours: "40",
        location: "Amsterdam, Nederland",
        salary: "1234",
        postingDate: "21 april 2020",
        about: "vacancy 1",
        skills: []
      },
      {
        id: "2",
        vacancyURL: "url",
        title: "title 2",
        broker: "Huxley",
        vacancyNumber: "2",
        hours: "40",
        location: "Amsterdam, Nederland",
        salary: "2341",
        postingDate: "21 april 2020",
        about: "vacancy 2",
        skills: []
      },
      {
        id: "3",
        vacancyURL: "url",
        title: "title 3",
        broker: "Jobbird",
        vacancyNumber: "3",
        hours: "40",
        location: "Amsterdam, Nederland",
        salary: "2143",
        postingDate: "21 april 2020",
        about: "vacancy 3",
        skills: []
      }
    ]
  };

export const noSkills = {
    _embedded: {
        skills: []
    }
  };