/// <reference types="cypress" />

const { exit } = require("process")

// tests can be written with either describe or context 
describe ('first test suite' , ()=> {


// // this is how u nest different test logic into a suite or test file 
//     describe ('suite section 1', ()=> {

//         beforeEach('login', () => {

//             //something u want to repeat before every test happens, this repeats before any tests inside this describe block only.
//         })

//         it('section 1 test' , ()=> {

//             //put the code for test here 
//         })
//     })

    it('first test' , ()=> {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //find element by tag name
        cy.get('input')
        
        //find element by ID 
        cy.get('#inputEmail1')
        
        //by class value
        cy.get('.input-full-width')
        
        //by attribute name
        cy.get('[fullwidth]')

          //by attribute name and value 
          cy.get('[placeholder="Email"]')

           //by entire class value
           cy.get('[class="input-full-width size-medium shape-rectangle"]')

           //by two attributes 
           cy.get('[placeholder="Email"][fullwidth]') //it should be continous like this without any spaces

        //    by tag, attribute id and class , or multiple locators together 
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')


        // by cypress test id 

        cy.get('[data-cy="imputEmail1"]')

    })

    it('second-test', ()=> {

        // get() find elements on the page by locator globally - already covered above 
        // find() find child elements by locator- can only be used in relation to the parent element
        // contains() find html text on the page - will look for the first text that matches , if there are 2 sign in
        //button only the first one will be selected 

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()  
 
        // cy.contains('Sign in').get('[status="warning"]')  - this will also work but get will find all the results regardless of the parent 

        // cy.contains('[status="warning"]', 'Sign in')

        // cy.contains('nb-card', 'Horizontal form').find('button')
        cy.contains('nb-card', 'Horizontal form').contains('Sign in')
        cy.contains('nb-card', 'Horizontal form').find('button')


        // cypress chains and DOM 

        cy.get('#inputEmail3')
        .parents('form')
        .find('button')
        .should('contain', 'Sign in')
        .parents('form')
        .find('nb-checkbox')
        .click() //it is not recommended to chain after an action like click , end the chain here 
    })

    // like modularity 
    it('saving subject of the command',()=>{

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click() 

        cy.contains('nb-card','Using the Grid').find('[for="inputEmail1"]').should('contain','Email')
        cy.contains('nb-card','Using the Grid').find('[for="inputPassword2"]').should('contain','Password')

        // // this wont work , like in other programming frameworks. the const will not work for the second time 
        // const usingTheGrid =  cy.contains('nb-card','Using the Grid')
        // usingTheGrid.find('[for="inputEmail1"]').should('contain','Email')
        // usingTheGrid.find('[for="inputPassword2"]').should('contain','Password')

        // Solutions , approad 1 , using cypress alias 
        cy.contains('nb-card','Using the Grid').as('usingTheGrid')
        // this will work
        cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain','Email')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain','Password')

        // Approach 2 
        // Cypress then() methods 
        // here initially the usingthegridform is a jquery
        cy.contains('nb-card','Using the Grid').then(usingTheGridForm=>{
            // as usingthegridform is jquery it is not chainable , hence it is important to wrap it with cy
            // these cannot be called outside either

            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain','Email')
            cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain','Password')
        })

    })

    it('extracting text values', ()=> {


        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click() 
        // method 1
        cy.get('[for="exampleInputEmail1"]').should('contain','Email address')

        // method 2
        cy.get('[for="exampleInputEmail1"]').then(label => {

            const labelText = label.text()
            expect(labelText).to.equal('Email address')
            cy.wrap(labelText).should('contain','Email address')
        })

        // method 3

        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text =>{

            expect(text).to.equal('Email address')
        })
        // invoke can also be used directly with assertion
        cy.get('[for="exampleInputEmail1"]').invoke('text').should('contain','Email address')
        // invoke can be used with alias as well 
        cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('contain','Email address')

        // method 4 , invoke can also be used for class validation , to check whether the class name matches 
        cy.get('[for="exampleInputEmail1"]').invoke('attr','class').then(classValue => {

            expect(classValue).to.equal('label')
        })

        // validate the property - like the text entered into a field , that is a property and not an attribute 
        // we are also using the modularity here using then() method to avoid repetetion
        cy.get('#exampleInputEmail1').type('test@test.com').then(exampleInputEmail1=> {

          cy.wrap(exampleInputEmail1).invoke('prop','value').should('eq','test@test.com').then(property=> {
            // use the property for further test validations 
            expect(property).to.equal('test@test.com')
          })
        })

     

    })

    // radio buttons

    it('radio buttons',()=> {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click() 
        // accessing the element and then finding the radio buttons using the type
        // here radiobuttons represent all the radio buttons in the ui for this sections as they are in order 
        cy.contains('nb-card','Using the Grid').find('[type="radio"]').then(radioButtons => {
            // the check function will only work with radio buttons and check boxes 
            // force is not recommended but if the element is default hidden u can use it to override the default behaviour
            cy.wrap(radioButtons).eq(0).check({force:true}).should('be.checked')
            cy.wrap(radioButtons).eq(1).check({force:true}).should('be.checked')
            cy.wrap(radioButtons).eq(0).should('not.be.checked')
            cy.wrap(radioButtons).eq(2).should('be.disabled')
        })

    })

    // check boxes 

    it('checkBoxes', ()=> {

        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click() 


        cy.get('[type="checkbox"]').eq(0).click({force:true})
        cy.get('[type="checkbox"]').eq(1).check({force:true})

        // cy.get('ngx-modal-overlays').find('.ng-star-inserted').find('[type="checkbox"]').then(checkBoxes => {
        //     // the check function will only work with radio buttons and check boxes 
        //     // force is not recommended but if the element is default hidden u can use it to override the default behaviour
        //     cy.wrap(checkBoxes).eq(0).check({force:true}).should('be.checked')
        //     cy.wrap(checkBoxes).eq(1).check({force:true}).should('be.checked')
        //     cy.wrap(checkBoxes).eq(0).should('be.checked')
        
        // })



    })

    it('datepicker',()=> {


        function selectDayFromCurrent(){
        // date variables are created to dynamically input the values instead of hardcoding  
        let date = new Date()
        date.setDate(date.getDate() + 60)
        let futureDay = date.getDate()
        let futureMonth = date.toLocaleDateString('en-US',{month:'short'})
        let futureYear = date.getFullYear()


        let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`

            cy.get('nb-calendar-navigation').invoke('attr','ng-reflect-date').then(dateAttribute => {

                if(!dateAttribute.includes(futureMonth) || (!dateAttribute.includes(futureYear))){
                    cy.get('[data-name="chevron-right"]').click()
                    // this makes this a recursive function inorder to repeat the process until the date becomes same
                    selectDayFromCurrent()
                }
                else{
                    // the not is used to exclude the dates grayed out which are from the prev month
                    cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
                }
            })
            return dateToAssert
        }


        // this is where the test begins 
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click() 
        cy.contains('nb-card','Common Datepicker').find('input').then(input=> {
            cy.wrap(input).click()
            const dateToAssert =  selectDayFromCurrent()
            cy.wrap(input).invoke('prop','value').should('contain',dateToAssert)
            // this assertion will also work 
            cy.wrap(input).should('have.value',dateToAssert)
        })
    })


    it('lists and dropdowns',()=> {

        cy.visit('/')
        // cy.get('nav').find('nb-select').click()
        // this selection will also work
        cy.get('nav nb-select').click()
    //    approach 1 - selcting items one by one
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain','Dark')

        // approach 2 -selecting items through each loop

        cy.get('nav nb-select').then(dropDown => {

            cy.wrap(dropDown).click()
            cy.get('.options-list nb-option').each((listItem,index)=> {

                const itemText= listItem.text().trim()
                cy.wrap(listItem).click()
                cy.wrap(dropDown).should('contain',itemText)
                if(index < 3){
                    cy.wrap(dropDown).click()
                }
              
            })

        })  
    
    })


    it('web tables', ()=> {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click() 

        //1 getting row with text 

        cy.get('tbody').contains('tr','Larry').then(rowItems => {

            cy.wrap(rowItems).find('.nb-edit').click()
            cy.wrap(rowItems).find('[placeholder="Age"]').clear().type('35')
            cy.wrap(rowItems).find('.nb-checkmark').click()
            // eq 6 is takesbecause there is not unique identifier for the age div so we count the position of td in the tr and take that value
            cy.wrap(rowItems).find('td').eq(6).should('contain','35')
        })

        // 2 getting row by index 

        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(tableRow => {


            cy.wrap(tableRow).find('[placeholder="First Name"]').click().type('John')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').click().type('Smith')
            cy.wrap(tableRow).find('.nb-checkmark').click()

        })

        cy.get('tbody tr').first().find('td').then(tableColumns=>{

        cy.wrap(tableColumns).eq(2).should('contain',"John")
        cy.wrap(tableColumns).eq(3).should('contain',"Smith")
        })

        // getting each row for validation

        const age = [20,30,40,200]

        cy.wrap(age).each (age=> {
            cy.get('thead [placeholder="Age"]').clear().type(age)

            //this wait is given because there is a slight delay by the application to get the filtered data , but if cypress run tests faster than
               // the result is obtained it will run into an error 
           cy.wait(1000)
           cy.get('tbody tr').each(tableRow=> {


            if(age == 200){
                cy.wrap(tableRow).should('contain','No data found')
            }
            else {
                cy.wrap(tableRow).find('td').eq(6).should('contain',age)
            }
           
        })
        
        })

    })

    it('tooltip', ()=> {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click() 

        cy.contains('nb-card', 'Colored Tooltips').contains('Default').click()
        // this nb-tooltip is got from  cypress console after inspecting
        cy.get('nb-tooltip').should('contain','This is a tooltip')

      

    })
    
    it.only('dialog-box', ()=> {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click() 

        // 1

        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', (confirm)=> {

            expect(confirm).to.equal('Are you sure you want to delete?')
        })

            // 2

            const stub = cy.stub()
            cy.on('window:confirm', stub)
            cy.get('tbody tr').first().find('.nb-trash').click().then(()=>{
                expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')

                // 3
                cy.get('tbody tr').first().find('.nb-trash').click()
                cy.on('window:confirm', (confirm)=> false)
            })



    })
   
})
 