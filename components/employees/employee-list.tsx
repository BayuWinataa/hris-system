import { getEmployees } from "@/app/actions/employee";
import { getDepartments } from "@/app/actions/department";
import { EmployeeTable } from "./employee-table";

export async function EmployeeList() {
    const [employees, departments] = await Promise.all([
        getEmployees(),
        getDepartments()
    ]);

    const formattedEmployees = employees.map(emp => ({
        ...emp,
        role: emp.role as "ADMIN" | "EMPLOYEE",
        employmentStatus: emp.employmentStatus as "TETAP" | "KONTRAK" | "MAGANG" | null,
    }));

    const formattedDepartments = departments.map(dept => ({
        id: dept.id,
        name: dept.name
    }));

    return <EmployeeTable data={formattedEmployees} departments={formattedDepartments} />;
}
