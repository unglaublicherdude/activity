/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { toggleMenuAction } from './filesUtils'

function showSidebarForFile(fileName: string) {
	closeSidebar()
	toggleMenuAction(fileName)
	cy.get('[data-cy-files-list-row-action="details"]')
		.should('be.visible')
		.findByRole('menuitem')
		.click()
	cy.get('#app-sidebar-vue').should('be.visible')
}

function closeSidebar() {
	cy.get('body')
		.then(($body) => {
			if ($body.find('.app-sidebar__close').length !== 0) {
				cy.get('.app-sidebar__close').click({ force: true })
			}
		})
	cy.get('#app-sidebar-vue').should('not.exist')
}

export function showActivityTab(fileName: string) {
	showSidebarForFile(fileName)
	cy.get('#app-sidebar-vue').contains('Activity').click()
}

export function addToFavorites(fileName: string) {
	toggleMenuAction(fileName)
	cy.get('[data-cy-files-list-row-action="favorite"]').should('contain', 'Add to favorites').click()
	cy.get('.toast-close').click()
}

export function removeFromFavorites(fileName: string) {
	toggleMenuAction(fileName)
	cy.get('[data-cy-files-list-row-action="favorite"]').should('contain', 'Remove from favorites').click()
	cy.get('.toast-close').click()
}

/**
 * Create a new public link share for a given file
 *
 * @param fileName Name of the file to share
 */
export function createPublicShare(fileName: string) {
	showSidebarForFile(fileName)
	cy.get('#app-sidebar-vue').contains('Sharing').click()

	cy.get('#app-sidebar-vue #tab-sharing').should('be.visible')
	cy.get('#app-sidebar-vue button.new-share-link').click({ force: true })
	cy.get('#app-sidebar-vue .sharing-entry__copy').should('be.visible')
	closeSidebar()
}

export function addTag(fileName: string, tag: string) {
	showSidebarForFile(fileName)

	cy.get('#app-sidebar-vue .app-sidebar-header')
		.should('be.visible')
		.findByRole('button', { name: 'Actions' })
		.click()

	cy.findByRole('menuitem', { name: 'Tags' })
		.should('be.visible')
		.click()

	cy.intercept('PUT', '**/remote.php/dav/systemtags-relations/files/**').as('tag')

	cy.findByLabelText('Search or create collaborative tags')
		.type(`${tag}{enter}{esc}`)

	cy.wait('@tag')
}

export function addComment(fileName: string, comment: string) {
	showSidebarForFile(fileName)
	cy.get('#app-sidebar-vue')
		.findByRole('tab', { name: 'Activity' })
		.click()

	cy.intercept('POST', '**/remote.php/dav/comments/files/*').as('comment')
	cy.get('#app-sidebar-vue')
		.findByRole('textbox', { name: 'New comment' })
		.should('be.visible')
		.type(`{selectAll}${comment}{enter}`)

	cy.wait('@comment')
}
