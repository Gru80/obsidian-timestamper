/* Changelog:
 *
 * V1.0.0 - Initial version
 * V1.1.0 - Migrated from dateformat to moment.js
 * V1.2.0 - Introduced option for linebreak after insert
 * 
 */

import { settings } from 'cluster';
import {
	App,
	ButtonComponent,
	Editor,
	Modal,
	Plugin,
	TextComponent,
	PluginSettingTab,
	Setting,
	moment
} from 'obsidian';

interface OtsPluginSettings {
	timeStampFormat: string;
	dateStampFormat: string;
	lastFormat: string;
	newLine: boolean;
}

const DEFAULT_SETTINGS: OtsPluginSettings = {
	timeStampFormat: 'hh:mm:ss',
	dateStampFormat: 'YYYY-MM-DD',
	lastFormat: '',
	newLine: false
}

// logThreshold: 0 ... only error messages
//               9 ... verbose output
const logThreshold = 9;
const logger = (logString: string, logLevel=0): void => {if (logLevel <= logThreshold) console.log ('TimeStamper: ' + logString)};
const version = '1.2.0-0001'

export default class TimeStamperPlugin extends Plugin {
	settings: OtsPluginSettings;

	async onload() {
		logger('Loading Plugin v' + version, 9);
		await this.loadSettings();

		this.addSettingTab(new TimeStamperSettingTab(this.app, this));

		this.addCommand({
			id: 'obsidian-custom-timestamp',
			name: 'Insert custom time/date stamp',
			editorCallback: (editor) => {
				new TimeStamperModal(this.app, editor, this.settings, this).open();
			},
		});

		this.addCommand({
			id: 'obsidian-fast-timestamp',
			name: 'Insert preconfigured time stamp',
			editorCallback: (editor) => {
				const now = new Date();
				const stamp = moment(now).format(this.settings.timeStampFormat);
				if (this.settings.newLine) {
					editor.replaceSelection(stamp + '\n');
					logger('new line', 9);
				}
				else {
					editor.replaceSelection(stamp);
					logger('no new line');
				}
			}
		});

		this.addCommand({
			id: 'obsidian-fast-datestamp',
			name: 'Insert preconfigured date stamp',
			editorCallback: (editor) => {
				const now = new Date();
				const stamp = moment(now).format(this.settings.dateStampFormat);
				if (this.settings.newLine) {
					editor.replaceSelection(stamp + '\n');
					logger('new line', 9);
				}
				else {
					editor.replaceSelection(stamp);
					logger('no new line');
				}
			}
		});

	}

	onunload() {
		logger('Bye!', 9);
	}

	async loadSettings() {
		logger('Loading Settings...', 6);
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		logger('timeStampFormat: ' + this.settings.timeStampFormat, 9);
		logger('dateStampFormat: ' + this.settings.dateStampFormat, 9);
		logger('lastFormat:      ' + this.settings.lastFormat, 9);
	}

	async saveSettings() {
		logger('Saving Settings...', 9);
		await this.saveData(this.settings);
	}

}

class TimeStamperModal extends Modal {
	constructor(app: App, editor: Editor, settings: OtsPluginSettings, plugin: Plugin) {
		super(app);
		this.editor = editor;
		this.settings = settings;
		this.plugin = plugin;
	}

	settings: OtsPluginSettings;
	editor: Editor;
	plugin: Plugin;

	onOpen() {
		const { contentEl, editor, modalEl } = this;
		const rowClass = 'row';
		const divClass = 'div';

		modalEl.addClass('timestamper-modal');
	
		// Create label and text field
		const containerEl = document.createElement(divClass);
		containerEl.addClass(rowClass);

		const targetEl = document.createElement(divClass);
		targetEl.addClass('input-wrapper');

		const labelEl = document.createElement(divClass);
		labelEl.addClass('input-label');
		labelEl.setText('Format string:');

		const formatComponent = new TextComponent(targetEl);
		formatComponent.setPlaceholder('e.g. YYYY-MM-DD');
		formatComponent.setValue(this.settings.lastFormat);
		
		// Create Button
		const buttonContainerEl = document.createElement(divClass);
		buttonContainerEl.addClass(rowClass);

		const submitButtonTarget = document.createElement(divClass);
		submitButtonTarget.addClass('button-wrapper');

		const submitButtonComponent = new ButtonComponent(submitButtonTarget);
	
		submitButtonComponent.setButtonText('Insert Date/Time Stamp');
		submitButtonComponent.setCta();
		submitButtonComponent.onClick(() => {
			const now = new Date();
			const stampFormat = formatComponent.getValue();
			const stamp = moment(now).format(stampFormat);
			if (this.settings.newLine) {
				editor.replaceSelection(stamp + '\n');
				logger('new line', 9);
			}
			else {
				editor.replaceSelection(stamp);
				logger('no new line');
			}
			
			this.settings.lastFormat = stampFormat;
			this.plugin.saveData(this.settings);
			this.close();			
		});
		
		// Add components to layout
		containerEl.appendChild(labelEl);
		containerEl.appendChild(targetEl);
		buttonContainerEl.appendChild(submitButtonTarget);

		contentEl.append(containerEl);
		contentEl.append(buttonContainerEl);

		submitButtonComponent.buttonEl.focus();
	}
	
	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class TimeStamperSettingTab extends PluginSettingTab {
	plugin: TimeStamperPlugin;

	constructor(app: App, plugin: TimeStamperPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Date Stamp Template')
			.setDesc('Template String for inserting a date stamp')
			.addText(text => text
				.setValue(this.plugin.settings.dateStampFormat)
				.onChange(async (value) => {
					logger('Settings update: ' + value, 9);
					this.plugin.settings.dateStampFormat = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Time Stamp Template')
			.setDesc('Template String for inserting a time stamp')
			.addText(text => text
				.setValue(this.plugin.settings.timeStampFormat)
				.onChange(async (value) => {
					logger('Settings update: ' + value, 9);
					this.plugin.settings.timeStampFormat = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
		    .setName('Insert line break')
			.setDesc('Add a line break after the time/date stamp')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.newLine)
				.onChange(async (value) => {
					this.plugin.settings.newLine = value;
					await this.plugin.saveSettings();
				}));
		
	}
}