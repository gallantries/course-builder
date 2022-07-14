import http from "@/http-common";

class VideoLibraryDataService {
  getVideosByTags(): Promise<any> {
    return http.get("/tags.json");
  }
  getSessions(): Promise<any> {
    return http.get("/sessions.json");
  }
  getInstructors(): Promise<any> {
    return http.get('/instructors.json');
  }
  getInstitutions(): Promise<any> {
    return http.get('/affiliations.json');
  }

  getEvent(id:any): Promise<any> {
    return http.get(`/${id}`);
  }
}
export default new VideoLibraryDataService();
