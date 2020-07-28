/*
*   The Angular Skill class is a DTO object exchanged with the backend for the purpose of maintaining the skills table
*
*   It differs from the backend skill object to prevent "knowledge" to creep into the functionality of the front end
*   about the skills particulars in the back end.
*
*   For this purpose, only name and id are used in this DTO object
*/


export class Skill {
    href: string;
    name: string;
}

