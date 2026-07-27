import { getDepartments } from "@/app/actions/department";
import { DepartmentTable } from "./department-table";

export async function DepartmentList() {
    const departments = await getDepartments();

    return <DepartmentTable data={departments} />;
}
