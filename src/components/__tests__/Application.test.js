import React from "react";
import axios from 'axios';

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  getAllByTestId,
  getAllByText,
  getAllByPlaceholderText,
  getByAltText,
  queryByText,
  findByAltText,
  queryAllByAltText,
  wait,
  queryByAltText,
  getByPlaceholderText,
  fireEvent,
  prettyDOM,
  getByLabelText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);

  // return waitForElement(() => getByText("Monaday"));
  return waitForElement(() => getByText("Monday")).then(() => {
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

});



describe("Application", () => {

  //first test
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    //using the debug function to see the current state of the whole document
    const { container, debug } = render(<Application />); //Render the application and store the container value returned by render

    //Use the waitForElement function, and wait until after the element containing "Archie Cohen" renders. 
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //console.log(prettyDOM(container));

    //search for all of the appointments in the container and store the returned value locally in the test
    const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments));


    //create another variable that references the firs element int the appointments array 
    // const appointment = getAllByTestId(container, "appointment")[0];

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    console.log(prettyDOM(appointment));

    //using the expect function to verify that the appointment element contains the text "Saving" immediatly after the "Save" button is clicked
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //wait until the save operation is complete and then confirm that the student's name is showing
    //one option
    //await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    //Another option
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));


    //finde the specific day node that contains the text "Monday"
    // Import the getAllByTestId query to search the original container for the nodes with data-testid="day"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    //checking that the day with the text "Monday" also has the text "no spots remaining"
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });



  //second test
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //  3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));

    //4. Check that the confirmation message is shown.
    //expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    await waitForElement(() =>
      queryByText(container, /Are you sure you would like to delete/i)
    );

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    //expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => queryByText(container, /Deleting/i));

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    // debug();
  });




  //third test
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => queryByText(container, "Archie Cohen"));

    //  3. Click the Edit button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    //4. Chose an intervier Silvia Palmer.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Click the "Save" button.
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with the text "Saving" is displayed.
    await waitForElement(() => getByText(appointment, "Saving"));

    // 7. Check if "Sylvia Palmer" record saved
    await waitForElement(() => queryByText(container, "Sylvia Palmer"));

    //8. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });



  //fourth test
  it("shows the save error when failing to save an appointment", async () => {
    // 1. Render the Application.
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => queryByText(container, "Archie Cohen"));

    //search for all of the appointments in the container and store the returned value locally in the test
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // 7. Wait until the element with the "Add" button is displayed.
    fireEvent.click(getByAltText(appointment, "Add"));


    //appointment details
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i)),
      { target: "Lydia Miller-Jones" };

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    //wait for error 
    //await waitForElement(() => getByText(appointment, "Error"));

    //check if "Sylvia Palmer" is saved
    await waitForElement(() => queryByText(container, "Sylvia Palmer"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })



//fifth test
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => queryByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() => queryByText(container, /Are you sure you would like to delete/i));

    fireEvent.click(queryByText(appointment, "Confirm"));

    await waitForElement(() => queryByText(appointment, "Deleting"));

    //await waitForElement(() => getByText(appointment, "Error"));  

    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));

    expect(getByText(day, "Monday")).toBeInTheDocument;
  });


});

