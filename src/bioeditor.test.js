import React from "react";
import BioEditor from "./bioeditor";
import { render, fireEvent } from "@testing-library/react";

test("When no bio is passed to it, a Save button is rendered", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector("button").innerHTML).toContain("Save");
});

test("When bio is passed to it, an Edit button is rendered", () => {
    const { container } = render(<BioEditor bio="test bio..." />);

    expect(container.querySelector("button").innerHTML).toContain("Edit");
});

test("Clicking either the Add or Edit button causes a textarea and a Save button to be rendered.", () => {
    const onClick = jest.fn();
    const { container } = render(<BioEditor onClick={onClick} />);
    fireEvent.click(container.querySelector("button"));

    expect(container.querySelector("textfield"));
});
