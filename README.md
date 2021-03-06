# Security Goals

[![Phase](https://img.shields.io/badge/Phase-Alpha-f90277.svg)](https://digital.canada.ca/products/)

### Demo

A demo can be found here: [https://github.com/cds-snc/security-goals-demo](https://github.com/cds-snc/security-goals-demo)

### Purpose

The purpose of this tool is to automate compliance checking for Kubernetes based applications. It assumes that certain aspects of compliance such as security and accessibility can be validated through automation, and therefore run at every deployment of the application. It leverages the introspectability of the Kubernetes cluster as well as multitude of external APIs that expose such information (ex. The GitHub API exposes data around code review).

### Motivation

> Automating controls that do not need to be verified by hand is what really matters.
> This frees up both security and developer time to focus on the harder problems.

### How do I use it

The tool is build out of multiple components listed below. Each component needs to be installed inside a Kubernetes cluster. You can view example manifest files in the `/manifests` directory or look at our live implementation here: [https://github.com/cds-snc/report-a-cybercrime/tree/master/compliance](https://github.com/cds-snc/report-a-cybercrime/tree/master/compliance).

### Components

The tools is built using the following components:

| Name               | Description                                                                        | Fully documented |
| ------------------ | ---------------------------------------------------------------------------------- | ---------------- |
| api                | Ingress checks and serves them up through a GraphQL API                            | No               |
| pdf-report         | A PDF report of complaince data                                                    | No               |
| web-report         | A user interface to explore data from the API                                      | No               |
| runner             | A tool to run compliance checks inside a Kubernetes cluster                        | Yes              |
| [security-goals-checks](https://github.com/cds-snc/security-goals-checks)  | A set of security goals check containers that do the actual checking | Yes              |

### Goals for the tool

As a result we set the following goals for the tool

- Leverage existing features in tools to automatically perform checks (Kubernetes Jobs)
- Use common APIs to complete checks (ex. GitHub API, List of Kubernetes Pods, Open Repositories)
- Decouple checks from reporting tool (Write checks in any language)
- Make reports available through multiple channels in real time (GraphQL, PDF, Web)
- Trigger checks on every release

### Workflow

The app roughly follows this high level flow:

1. Merge on GitHub to master kicks off a continuous testing / continuous delivery process to a Kubernetes cluster as a release.
2. When app is deployed on the cluster it triggers a list of jobs to be run on the Kubernetes cluster (Watcher).
3. Jobs are containers written in different programming languages (Go, Rust, Javascript, Crystal) that automatically check against controls with the ITSG-33, or other.
4. Each container writes a JSON file to a shared directory, tagged with the release ID.
5. Javascript app (API) watches the directory and ingests JSON files, loading them into a MongoDB and sorts them by control and release. This app also serves the data through a GraphQL API.
6. Second Javascript app (UI) renders the data in a user friendly format

Following is a graphical representation of the same flow:

![symmorfosi](https://user-images.githubusercontent.com/867334/54229980-d4c94e80-44db-11e9-9db3-3311887186a2.png)


### How do I write a check?

Please see this [guide](https://github.com/cds-snc/security-goals/blob/master/docs/writing-a-check.md)



### Questions?

Please contact us through any of the multiple ways listed on our [website](https://digital.canada.ca/).

![Compliance Sheriff](https://user-images.githubusercontent.com/867334/58421189-5a7d8480-805d-11e9-8cfb-cff5b04cf62d.png)

