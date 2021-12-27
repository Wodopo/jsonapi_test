require('dotenv').config();
const Person = require('./models/person');
const City = require('./models/city');
const Company = require('./models/company');
const faker = require('faker');

const seed = async () => {
    await seedPeople(10000);
    await seedCities(100);
    await seedCompanies(100);

    await linkPeopleToCities();
    await linkCompaniesToCities();
    await linkPeopleToCompanies();
};

const seedPeople = async (total) => {
    process.stdout.write('Seeding People...');
    const peopleMissing = total - (await Person.count());
    for (let i = 0; i < peopleMissing; i++) {
        const randomName = faker.name.findName();
        const randomEmail = faker.internet.email();
        try {
            await Person.add(randomName, randomEmail);
        } catch (e) {
            //console.log(e.message);
        }
    }
    console.log(' Done!');
};

const seedCities = async (total) => {
    process.stdout.write('Seeding Cities...');
    const citiesMissing = total - (await City.count());
    for (let i = 0; i < citiesMissing; i++) {
        const name = faker.address.cityName();
        const state = faker.address.stateAbbr();
        try {
            await City.add(name, state);
        } catch (e) {
            //console.log(e.message);
        }
    }
    console.log(' Done!');
};

const seedCompanies = async (total) => {
    process.stdout.write('Seeding Companies...');
    const companiesMissing = total - (await Company.count());
    for (let i = 0; i < companiesMissing; i++) {
        const name = faker.company.companyName();
        try {
            await Company.add(name);
        } catch (e) {
            //console.log(e.message);
        }
    }
    console.log(' Done!');
};

const linkPeopleToCities = async () => {
    process.stdout.write('Linking People to Cities...');
    const people = await Person.getAll();
    const cities = await City.getAll();
    people.forEach(async (p) => {
        await setPersonCity(p.person_id, cities);
    });
    console.log(' Done!');
};

const setPersonCity = async (person_id, cities) => {
    const randomIndex = Math.round(Math.random() * (cities.length - 1));
    const city = cities[randomIndex];
    await Person.setCity(person_id, city.city_id);
};

const linkPeopleToCompanies = async () => {
    process.stdout.write('Linking People to Companies...');
    const peopleCities = await Person.getAllPeopleCities();
    peopleCities.forEach(async (p) => {
        const companies = await Company.getFromCityID(p.city_id);
        if (companies.length !== 0) {
            await setPersonCompany(p.person_id, companies);
        }
    });
    console.log(' Done!');
};

const setPersonCompany = async (person_id, companies) => {
    const randomIndex = Math.round(Math.random() * (companies.length - 1));
    const company = companies[randomIndex];
    await Person.setCompany(person_id, company.company_id);
};

const linkCompaniesToCities = async () => {
    process.stdout.write('Linking Companies to Cities...');
    const company = await Company.getAll();
    const cities = await City.getAll();
    company.forEach(async (c) => {
        await setCompanyCity(c.company_id, cities);
    });
    console.log(' Done!');
};

const setCompanyCity = async (company_id, cities) => {
    const randomIndex = Math.round(Math.random() * (cities.length - 1));
    const city = cities[randomIndex];
    await Company.setCity(company_id, city.city_id);
};

//seed();

const test = async () => {
    const unemployedCount = await Person.getAllUnemployed();
    console.log(unemployedCount);
};

test();
