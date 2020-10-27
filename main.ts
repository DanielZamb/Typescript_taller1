import { Student } from './Student';
import { dataStundent } from './dataStudent.js';
import { dataCourses } from './dataCourses.js';
import { Course } from './course.js';


let coursesTbody: HTMLElement = document.getElementById("courses")!;
let personalDtaTBody: HTMLElement = document.getElementById("personalData")!;
const btnfilterByName: HTMLElement = document.getElementById("button-filterByName")!;
const btnfilterByCredits: HTMLElement = document.getElementById("button-filterByCredits")!;
const inputSearchBox: HTMLInputElement = <HTMLInputElement> document.getElementById("search-box")!;
const inputMinBox: HTMLInputElement = <HTMLInputElement> document.getElementById("min-search-box")!;
const inputMaxBox: HTMLInputElement = <HTMLInputElement> document.getElementById("max-search-box")!;
const totalCreditElm: HTMLElement = document.getElementById("total-credits")!;

btnfilterByName.onclick = () => applyFilterByName(); //duda: por que no simplemente asignarle al evento "onclick" la funcion applyFilterByName()?
btnfilterByCredits.onclick = () => applyFilterByCredits();
//asocia el evento con una

renderPersonalData(dataStundent);//llamar al render de personalData
renderCoursesInTable(dataCourses);

totalCreditElm.innerHTML = `${getTotalCredits(dataCourses)}`

function renderPersonalData(student:Student):void{
    console.log('Desplegando info del estudiante');
    for(let [key,value] of Object.entries(student)){
        console.log(key+':'+value);
        let trElement = document.createElement("tr");
        trElement.innerHTML = `<td>${key}</td>
                               <td>${value}</td>`;
        personalDtaTBody.appendChild(trElement);
    }
}
function renderCoursesInTable(courses: Course[]): void {
    console.log('Desplegando cursos');
    courses.forEach((course) => {
        let trElement = document.createElement("tr");
        trElement.innerHTML = `<td>${course.name}</td>
                                <td>${course.professor}</td>
                                <td>${course.credits}</td>`;
        coursesTbody.appendChild(trElement);
    }); 
    //aqui lo hacen en un body vacio, pero puede hacerse un append al final del componente HTML anterior.
    //$(selector).action()
    //jQuery $: sign to define/access jQuery
    // A (selector) to "query HTML" elements
    //A jQuery action() to be performed on the element(s)
}

function applyFilterByCredits(){
    let min:number = parseInt(inputMinBox.value);
    let max:number = parseInt(inputMaxBox.value);
    let courses: Course[] = dataCourses;
    let coursesFiltered: Course[]=[];
    min = (min == null)? 0:min;
    max = (max == null)? getTotalCredits(dataCourses):max;
    clearCoursesInTable();
    courses.sort((c1,c2):number=> { 
        if (c1.credits>c2.credits) return 1;
        else if (c1.credits<c2.credits) return -1;
        else return 0;
    });
    let minIndex: number = searchIndexOfCredits(min,0,courses.length-1,courses);
    let maxIndex: number = searchIndexOfCredits(max,0,courses.length-1,courses);
    for( let i = minIndex; i<=maxIndex ; i++){
        coursesFiltered.push(courses[i]);
    }
    renderCoursesInTable(coursesFiltered);
}
function searchIndexOfCredits(target:number,lo:number,hi:number,sortedCourses:Course[]): number{
    let mid:number = Math.floor((hi/2) + lo);
    if (mid == sortedCourses.length) --mid;
        if (target>sortedCourses[mid].credits) return searchIndexOfCredits(target,mid,hi,sortedCourses);
        else if (target<sortedCourses[mid].credits) return searchIndexOfCredits(target,lo,mid,sortedCourses); 
        else return mid;
    }
function applyFilterByName(){
    let text = inputSearchBox.value; // let text = inputSearchBox.value!<--?
    text = (text == null)? '':text;
    clearCoursesInTable();
    let coursesFiltered: Course[] = searchCourseByName(text,dataCourses);
    renderCoursesInTable(coursesFiltered);
}
function searchCourseByName(nameKey: string, courses: Course[]):Course[]{
    let courseStrings: string[] = [];
    let wantedCourse: Course[] = [];
    if (nameKey === ''){
        wantedCourse = dataCourses;
    }
    else if (!nameKey.includes(",")){
        wantedCourse = courses.filter(c => c.name.match(nameKey));
    }
    else {
        courseStrings = nameKey.split(",");
        courses.sort((c1,c2) => c1.name.localeCompare(c2.name));
        console.log(courses);
        for(let i=0;i<courseStrings.length;i++){ //considerar implementar busqueda por Arbol binario rojo-negro RB-BST.
            let sCourse: string = courseStrings[i];
            let firstLetter: string = sCourse.split("")[0];
            courses.forEach(c => {
                if (c.name.startsWith(firstLetter) &&  c.name.localeCompare(sCourse) == 0)
                   wantedCourse.push(c);
                else if (c.name.split("")[0].localeCompare(firstLetter)>0)
                return;
            })
        }
    }
    //return nameKey === '' ? dataCourses: courses.filter(c => c.name.match(nameKey));
    return wantedCourse;
}
function getTotalCredits(courses: Course[]): number{
    let totalCredits: number = 0;
    courses.forEach((course)=> totalCredits = totalCredits+course.credits);
    //coursses.reduce((totalCredits,course)=> totalCredits+course.credits);
    return totalCredits;
}
function clearCoursesInTable(){
    while (coursesTbody.childElementCount>0){ //si se use has childNodes se queda pegado en un loop infinito.
        if (coursesTbody.firstChild!=null){
            coursesTbody.removeChild(coursesTbody.firstChild);
        }
    }
}