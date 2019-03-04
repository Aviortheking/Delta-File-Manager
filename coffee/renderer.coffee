# import Gitlab from 'gitlab'
{ ProjectBundle } = require('gitlab')

options = {
	url: 'https://gitlab.com'
	token: ''
}

gitlab = new ProjectBundle(options)
# this is actually a test
forceRefresh = true

user = undefined
getUser = () ->
	if user is undefined or forceRefresh
		user = await gitlab.Users.current()
	user

projects = undefined
getProjects = () ->
	console.log "loading Projects!"

	if projects is undefined or forceRefresh
		console.log "loading Projects!"

		projects = await gitlab.Projects.all { membership: true }
	console.log projects
	projects

project = {}
getProject = (projectId) ->
	if projectId isnt undefined
		if project[projectId] is undefined or forceRefresh
			project[projectId] = await (gitlab.Projects).show projectId
		return project[projectId]
	return undefined

projectTree = {}
getProjectTree = (projectId) ->
	if projectId isnt undefined
		if projectTree[projectId] is undefined or forceRefresh
			projectTree[projectId] = await gitlab.Repositories.tree(projectId, { recursive: true }).catch (e) ->
				console.log "pouet"
				console.log ed

		return projectTree[projectId]
	return undefined

loadProjects = (parent) ->
	for el in await getProjects()
		tr = document.createElement 'tr'
		name = el.name_with_namespace.split '/'
		name.pop()
		td = "<td>" + el.id + "</td><td>" + el.name + "</td><td>" + name.join(" -> ") + "</td>"
		tr.innerHTML = td
		tr.setAttribute 'data-id', el.id
		tr.addEventListener 'click', (event) ->
			console.log event
			loadProjectTree document.querySelector(".tree"), event.target.parentNode.getAttribute("data-id")
			return
		parent.appendChild tr
	return

loadProjectTree = (parent, projectId) ->
	parent.innerHTML = ''
	for el in await getProjectTree projectId
		path = el.path.split "/"
		path.pop()
		tempParent = parent
		if el.type is "tree" then element = "<ul data-path=\"" + el.name + "\"></ul>"
		else element = "<li>" + el.name + "</li>"
		if path.length > 1
			tempParent = parent.querySelector "[data-path=\"" + path.pop() + "\"]"
		tempParent.innerHTML += element
	for el in parent.querySelectorAll("[data-path]")
		li = document.createElement "li"
		text = document.createTextNode el.getAttribute("data-path") + "/"
		li.appendChild text
		li.classList.add "folder"
		el.parentNode.insertBefore(li, el)
	return

loadProjects(document.querySelector('.projectList'))
# console.log projects
