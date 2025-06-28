"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { PermissionCard } from "@/components/permissions/permission-card"
import { permissionFixture } from "../fixtures/permission.fixture"
import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

describe("PermissionCard", () => {
  const mockPermission = permissionFixture.userManagement
  const mockOnToggle = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render permission information", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    expect(screen.getByText(mockPermission.description)).toBeInTheDocument()
    expect(screen.getByText(mockPermission.name)).toBeInTheDocument()
    expect(screen.getByText(mockPermission.category)).toBeInTheDocument()
  })

  it("should show granted state correctly", () => {
    render(<PermissionCard permission={mockPermission} granted={true} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch")
    expect(toggle).toBeChecked()
  })

  it("should show not granted state correctly", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch")
    expect(toggle).not.toBeChecked()
  })

  it("should call onToggle when switch is clicked", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch")
    fireEvent.click(toggle)

    expect(mockOnToggle).toHaveBeenCalledWith(mockPermission.id, true)
  })

  it("should call onToggle with false when granted permission is toggled", () => {
    render(<PermissionCard permission={mockPermission} granted={true} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch")
    fireEvent.click(toggle)

    expect(mockOnToggle).toHaveBeenCalledWith(mockPermission.id, false)
  })

  it("should be disabled when loading", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} loading={true} />)

    const toggle = screen.getByRole("switch")
    expect(toggle).toBeDisabled()
  })

  it("should show loading state", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} loading={true} />)

    expect(screen.getByTestId("permission-loading")).toBeInTheDocument()
  })

  it("should display category badge", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    const categoryBadge = screen.getByText(mockPermission.category)
    expect(categoryBadge).toHaveClass("badge")
  })

  it("should have proper accessibility attributes", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch")
    expect(toggle).toHaveAttribute("aria-label", `Toggle ${mockPermission.description}`)
  })

  it("should show granted indicator when permission is granted", () => {
    render(<PermissionCard permission={mockPermission} granted={true} onToggle={mockOnToggle} />)

    expect(screen.getByTestId("granted-indicator")).toBeInTheDocument()
  })

  it("should not show granted indicator when permission is not granted", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    expect(screen.queryByTestId("granted-indicator")).not.toBeInTheDocument()
  })

  it("should handle keyboard navigation", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch")

    // Simulate Enter key press
    fireEvent.keyDown(toggle, { key: "Enter", code: "Enter" })
    expect(mockOnToggle).toHaveBeenCalledWith(mockPermission.id, true)
  })

  it("should handle space key navigation", () => {
    render(<PermissionCard permission={mockPermission} granted={false} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch")

    // Simulate Space key press
    fireEvent.keyDown(toggle, { key: " ", code: "Space" })
    expect(mockOnToggle).toHaveBeenCalledWith(mockPermission.id, true)
  })
})
