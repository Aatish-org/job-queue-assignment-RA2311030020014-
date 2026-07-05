"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStatus = void 0;
var JobStatus;
(function (JobStatus) {
    JobStatus["QUEUED"] = "queued";
    JobStatus["RUNNING"] = "running";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["FAILED"] = "failed";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
