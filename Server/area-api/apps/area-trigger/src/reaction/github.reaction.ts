import { ApiHeader } from '@nestjs/swagger'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {GithubService} from "../../../area-api/src/auth/oauth2/service/github/github.service";

@Injectable()
export class GithubReaction {
  private readonly apiVersion
  private readonly url = 'https://api.github.com'
  public reactionMap: { [key: number | string]: () => void } = {}
  constructor(
    private readonly config: ConfigService,
    private readonly githubService: GithubService,
  ) {
    this.apiVersion = this.config.get('github.api_version')
    this.reactionMap = {
      getToken: this.callRefreshToken.bind(this),
      0: this.createPublicRepository.bind(this),
      1: this.createPrivateRepository.bind(this),
      2: this.createPrivateRepositoryWithTemplate.bind(this),
      3: this.createPublicRepositoryWithTemplate.bind(this),
      4: this.createPrivateOrganisationRepository.bind(this),
      5: this.createPublicOrganisationRepository.bind(this),
      6: this.updateGithubRepository.bind(this),
      7: this.deleteGithubRepository.bind(this),
      8: this.enableAutomatedSecurityFixes.bind(this),
      9: this.disableAutomatedSecurityFixes.bind(this),
      10: this.enableVulnerabilityAlerts.bind(this),
      11: this.disableVulnerabilityAlerts.bind(this),
      12: this.disablePrivateVulnerabilityReportingForRepository.bind(this),
      13: this.enablePrivateVulnerabilityReportingForRepository.bind(this),
      14: this.createAForkRepository.bind(this),
      15: this.renameARepositoryBranch.bind(this),
      16: this.createRepositoryBranch.bind(this),
      17: this.updateRepositoryBranch.bind(this),
      18: this.deleteRepositoryBranch.bind(this),
    }
  }

  async callRefreshToken(refresh_token: string) {
    return [refresh_token, refresh_token]
  }

// Create a public repository
  // datas contains all the body query needed
  async createPublicRepository(access_token: string, datas) {
    datas.private = false
    const apiUrl = `${this.url}/user/repos`
    const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
    }
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(datas)
        })
        const response_data = (await response.json())
        if (response.ok){
            console.log(`[${datas.name}] github public repository succesfully created`)
            return "Unique"
          }
        else {
            const message = `Unable to create github public repository: ${response_data.errors[0].message ? response_data.errors[0].message : undefined}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  // Create a private repository
  // datas contains all the body query needed
  async createPrivateRepository(access_token: string, datas) {
    datas.private = true
    const apiUrl = `${this.url}/user/repos`
    const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
    }
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(datas)
        })
        const response_data = (await response.json())
        if (response.ok){
          console.log(`[${datas.name}] github private repository succesfully created`)
          return "Unique"}
        else {
            const message = `Unable to create github public repository: ${response_data.errors[0].message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  // Create a private repository from a template
  // datas contains all the body query needed
  async createPrivateRepositoryWithTemplate(access_token: string, datas) {
    const {template_owner, template_repo, ...rest} = datas
    rest.private = true
    const apiUrl = `${this.url}/repos/${template_owner}/${template_repo}/generate`
    const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
    }
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(rest)
        })
        if (response.ok){
          console.log(`[${datas.name}] github private repository succesfully created with [${template_repo}] template`)
          return "Unique"}
        else {
            const response_data = (await response.json())
            const message = `Unable to create github public repository: ${response_data.message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  // Create a public repository from a template
  // datas contains all the body query needed
  async createPublicRepositoryWithTemplate(access_token: string, datas) {
    const {template_owner, template_repo, ...rest} = datas
    rest.private = false
    const apiUrl = `${this.url}/repos/${template_owner}/${template_repo}/generate`
    const headers = {
        "Authorization": `Bearer ${access_token}`,
        "X-GitHub-Api-Version": this.apiVersion,
        "Accept": "application/vnd.github+json",
    }
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(rest)
        })
        if (response.ok){
          console.log(`[${datas.name}] github public repository succesfully created with [${template_repo}] template`)
          return "Unique"}
          else {
            const response_data = (await response.json())
            const message = `Unable to create github public repository: ${response_data.message}`
            throw new Error(message)
        }
    }
    catch (err) {
        throw new InternalServerErrorException(err.message)
    }
  }

  async createPrivateOrganisationRepository(access_token: string, datas) {
    const {org , ...rest} = datas
    rest.private = true // set to private
    const apiUrl = `${this.url}/orgs/${org}/repos`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(rest)
      })
      if (response.ok){
        console.log(`organisation: [${org}] : [${datas.name}] github private repository succesfully created`)
        return "Unique"}
      else {
        const response_data = (await response.json())
        const message = `Unable to create github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async createPublicOrganisationRepository(access_token: string, datas) {
    const {org , ...rest} = datas
    rest.private = false // set to public

    const apiUrl = `${this.url}/orgs/${org}/repos`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(rest)
      })
      if (response.ok){
      console.log(`organisation: [${org}] : [${datas.name}] github public repository succesfully created`)
      return "Unique"}
      else {
          const response_data = (await response.json())
          const message = `Unable to create github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async updateGithubRepository(access_token: string, datas) {
    const {owner, repo , ...rest} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(rest)
      })
      if (response.ok)
      console.log(`[${datas.repo}] github repository succesfully updated with : ${rest}`)
      else {
          const response_data = (await response.json())
          const message = `Unable to create github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async deleteGithubRepository(access_token: string, datas) {
    const {owner, repo} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: headers,
      })
      if (response.ok) {
        console.log(`[${repo}] github repository succesfully deleted`)
        return "Unique"
      }
      else {
          const response_data = (await response.json())
          const message = `Unable to delete github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  // Vulnerability alert enabled
  async enableAutomatedSecurityFixes(access_token: string, datas) {
    const {owner, repo} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/automated-security-fixes`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "PUT",
          headers: headers,
      })
      if (response.ok){
            console.log(`[${repo}] github repository automated security fixes enabled`)
            return "Unique"}
      else {
          const response_data = (await response.json())
          const message = `Unable to delete github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async disableAutomatedSecurityFixes(access_token: string, datas) {
    const {owner, repo} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/automated-security-fixes`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: headers,
      })
      if (response.ok){
            console.log(`[${repo}] github repository automated security fixes disabled`)
            return "Unique"
          }
      else {
        const response_data = (await response.json())
          const message = `Unable to delete github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }
  
  async enableVulnerabilityAlerts(access_token: string, datas) {
    const {owner, repo} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/vulnerability-alerts`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "PUT",
          headers: headers,
      })
      if (response.ok) {
      console.log(`[${repo}] : github repository vulnerability alert enabled`)
      return "Unique"
    }
      else {
        const response_data = (await response.json())
          const message = `Unable to delete github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async disableVulnerabilityAlerts(access_token: string, datas) {
    const {owner, repo} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/vulnerability-alerts`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: headers,
      })
      if (response.ok) {
          console.log(`[${repo}] : github repository vulnerability alert disabled`)
          return "Unique"
        }
      else {
         const response_data = (await response.json())
          const message = `Unable to delete github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  // Public repo and not archived
  async disablePrivateVulnerabilityReportingForRepository(access_token: string, datas) {
    const {owner, repo} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/private-vulnerability-reporting`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: headers,
      })
      if (response.ok)  {
        console.log(`[${repo}] : github repository vulnerability reporting disabled`)
        return "Unique"
      }
      else {
          const response_data = (await response.json())
          const message = `Unable to delete github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  // Public repo and not archived
  async enablePrivateVulnerabilityReportingForRepository(access_token: string, datas) {
    const {owner, repo} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/private-vulnerability-reporting`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "PUT",
          headers: headers,
      })
      if (response.ok) {
          console.log(`[${repo}] : github repository vulnerability reporting enable`)
          return "Unique"
      }
      else {
          const response_data = (await response.json())
          const message = `Unable to delete github public repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async createAForkRepository(access_token: string, datas) {
    const {owner, repo, ...rest} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/forks`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body:JSON.stringify(rest)
      })
      if (response.ok) {
       const response_data = (await response.json())
          console.log(`[${response_data.name}] : github repository sucessfully forked from ${owner}/${repo}`)
          return "Unique"
      }
      else {
        const response_data = (await response.json())
          const message = `Unable to fork github repository: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async renameARepositoryBranch(access_token: string, datas) {
    const {owner, repo, branch , ...rest} = datas
    const apiUrl = `${this.url}/repos/${owner}/${repo}/branches/${branch}/rename`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(rest)
      })
      if (response.ok) {
          const response_data = (await response.json())
          console.log(`[${repo}] : github repository branch sucessfully renamed ${response_data.name}`)
          return "Unique"
      }
      else {
          const response_data = (await response.json())
          const message = `Unable to rename github repository branch: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  // https://docs.github.com/fr/rest/git/refs?apiVersion=2022-11-28
  async createRepositoryBranch(access_token: string, datas) {
    const {owner, repo , ...rest} = datas
    rest.ref = `refs/heads/${rest.ref}`.replace(/\s+/g, "-")
    const apiUrl = `${this.url}/repos/${owner}/${repo}/git/refs`
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(rest)
      })
      if (response.ok) {
          const response_data = (await response.json())
          console.log(`[${repo}] : github repository branch sucessfully created ${response_data.url} from ${rest.sha}`)
          return "Unique"
      }
      else {
        const response_data = (await response.json())
          const message = `Unable to create github repository branch: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async updateRepositoryBranch(access_token: string, datas) {
    const {owner, repo, ref , ...rest} = datas
    const refs = `heads/${ref}`.replace(/\s+/g, "-")
    const apiUrl = `${this.url}/repos/${owner}/${repo}/git/refs/${refs}`

    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(rest)
      })
      if (response.ok) {
          const response_data = (await response.json())
          console.log(`[${repo}] : github repository branch sucessfully updated ${response_data.url} from ${rest.sha}`)
          return "Unique"
      }
      else {
          const response_data = (await response.json())
          const message = `Unable to updated github repository branch: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async deleteRepositoryBranch(access_token: string, datas) {
    const {owner, repo, ref , ...rest} = datas
    const refs = `heads/${ref}`.replace(/\s+/g, "-")
    const apiUrl = `${this.url}/repos/${owner}/${repo}/git/refs/${refs}`

    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "X-GitHub-Api-Version": this.apiVersion,
      "Accept": "application/vnd.github+json",
    }
    try {
      const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: headers,
      })
      if (response.ok) {
          console.log(`[${repo}] : github repository branch sucessfully deleted`)
          return "Unique"
      }
      else {
          const response_data = (await response.json())
          const message = `Unable to deleted github repository branch: ${response_data.message}`
          throw new Error(message)
        }
      }
      catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }
}
