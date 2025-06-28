#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Set environment variables for testing
export NODE_ENV=test
export DATABASE_URL=${TEST_DATABASE_URL:-"postgresql://test:test@localhost:5432/test_db"}

print_status "Starting test suite..."
print_status "Environment: $NODE_ENV"
print_status "Database: $DATABASE_URL"

# Function to run backend tests
run_backend_tests() {
    print_status "Running backend tests..."
    
    # Unit tests
    print_status "Running unit tests..."
    cd src && npm run test:unit
    UNIT_EXIT_CODE=$?
    
    if [ $UNIT_EXIT_CODE -eq 0 ]; then
        print_success "Unit tests passed!"
    else
        print_error "Unit tests failed!"
        return $UNIT_EXIT_CODE
    fi
    
    # Integration tests
    print_status "Running integration tests..."
    npm run test:integration
    INTEGRATION_EXIT_CODE=$?
    
    if [ $INTEGRATION_EXIT_CODE -eq 0 ]; then
        print_success "Integration tests passed!"
    else
        print_error "Integration tests failed!"
        return $INTEGRATION_EXIT_CODE
    fi
    
    # E2E tests
    print_status "Running E2E tests..."
    npm run test:e2e
    E2E_EXIT_CODE=$?
    
    if [ $E2E_EXIT_CODE -eq 0 ]; then
        print_success "E2E tests passed!"
    else
        print_error "E2E tests failed!"
        return $E2E_EXIT_CODE
    fi
    
    cd ..
    return 0
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "Running frontend tests..."
    
    # Component tests
    print_status "Running component tests..."
    npm run test:components
    COMPONENT_EXIT_CODE=$?
    
    if [ $COMPONENT_EXIT_CODE -eq 0 ]; then
        print_success "Component tests passed!"
    else
        print_error "Component tests failed!"
        return $COMPONENT_EXIT_CODE
    fi
    
    # Integration tests
    print_status "Running frontend integration tests..."
    npm run test:integration:frontend
    FRONTEND_INTEGRATION_EXIT_CODE=$?
    
    if [ $FRONTEND_INTEGRATION_EXIT_CODE -eq 0 ]; then
        print_success "Frontend integration tests passed!"
    else
        print_error "Frontend integration tests failed!"
        return $FRONTEND_INTEGRATION_EXIT_CODE
    fi
    
    return 0
}

# Function to generate coverage report
generate_coverage() {
    print_status "Generating coverage report..."
    
    # Backend coverage
    cd src && npm run test:coverage
    cd ..
    
    # Frontend coverage
    npm run test:coverage:frontend
    
    # Merge coverage reports
    npx nyc merge coverage coverage/merged.json
    npx nyc report --reporter=html --reporter=text --temp-dir=coverage
    
    print_success "Coverage report generated in coverage/ directory"
}

# Function to run linting
run_linting() {
    print_status "Running linting..."
    
    # Backend linting
    cd src && npm run lint
    BACKEND_LINT_EXIT_CODE=$?
    cd ..
    
    # Frontend linting
    npm run lint
    FRONTEND_LINT_EXIT_CODE=$?
    
    if [ $BACKEND_LINT_EXIT_CODE -eq 0 ] && [ $FRONTEND_LINT_EXIT_CODE -eq 0 ]; then
        print_success "Linting passed!"
        return 0
    else
        print_error "Linting failed!"
        return 1
    fi
}

# Function to run type checking
run_type_check() {
    print_status "Running type checking..."
    
    # Backend type check
    cd src && npm run type-check
    BACKEND_TYPE_EXIT_CODE=$?
    cd ..
    
    # Frontend type check
    npm run type-check
    FRONTEND_TYPE_EXIT_CODE=$?
    
    if [ $BACKEND_TYPE_EXIT_CODE -eq 0 ] && [ $FRONTEND_TYPE_EXIT_CODE -eq 0 ]; then
        print_success "Type checking passed!"
        return 0
    else
        print_error "Type checking failed!"
        return 1
    fi
}

# Main execution
main() {
    local test_type=${1:-"all"}
    local exit_code=0
    
    case $test_type in
        "backend")
            run_backend_tests
            exit_code=$?
            ;;
        "frontend")
            run_frontend_tests
            exit_code=$?
            ;;
        "lint")
            run_linting
            exit_code=$?
            ;;
        "type-check")
            run_type_check
            exit_code=$?
            ;;
        "coverage")
            generate_coverage
            exit_code=$?
            ;;
        "all")
            print_status "Running complete test suite..."
            
            # Run type checking first
            run_type_check
            if [ $? -ne 0 ]; then
                print_error "Type checking failed, stopping tests"
                exit 1
            fi
            
            # Run linting
            run_linting
            if [ $? -ne 0 ]; then
                print_warning "Linting failed, but continuing with tests"
            fi
            
            # Run backend tests
            run_backend_tests
            if [ $? -ne 0 ]; then
                print_error "Backend tests failed"
                exit_code=1
            fi
            
            # Run frontend tests
            run_frontend_tests
            if [ $? -ne 0 ]; then
                print_error "Frontend tests failed"
                exit_code=1
            fi
            
            # Generate coverage if all tests passed
            if [ $exit_code -eq 0 ]; then
                generate_coverage
            fi
            ;;
        *)
            print_error "Unknown test type: $test_type"
            print_status "Available options: backend, frontend, lint, type-check, coverage, all"
            exit 1
            ;;
    esac
    
    if [ $exit_code -eq 0 ]; then
        print_success "All tests completed successfully!"
    else
        print_error "Some tests failed!"
    fi
    
    exit $exit_code
}

# Show usage if help is requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [test_type]"
    echo ""
    echo "Test types:"
    echo "  backend     - Run backend tests only"
    echo "  frontend    - Run frontend tests only"
    echo "  lint        - Run linting only"
    echo "  type-check  - Run type checking only"
    echo "  coverage    - Generate coverage report"
    echo "  all         - Run all tests (default)"
    echo ""
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 backend      # Run only backend tests"
    echo "  $0 frontend     # Run only frontend tests"
    echo "  $0 coverage     # Generate coverage report"
    exit 0
fi

# Run main function
main "$1"
