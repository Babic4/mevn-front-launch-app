import { request } from "./generic.service";

const getNewProjects = () => request({ url: "admin/projects", method: "get" });

export { getNewProjects };
