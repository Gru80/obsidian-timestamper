import {
	App,
	ButtonComponent,
	Editor,
	Modal,
	Plugin,
	TextComponent,
	PluginSettingTab,
	Setting
} from 'obsidian';

import dateFormat from 'dateformat';

interface OtsPluginSettings {
	timeStampFormat: string;
	dateStampFormat: string;
	lastFormat: string;
}

const DEFAULT_SETTINGS: OtsPluginSettings = {
	timeStampFormat: 'HH:MM:ss',
	dateStampFormat: 'yyyy-mm-dd',
	lastFormat: ''
}

// logThreshold: 0 ... only error messages
//               9 ... verbose output
const logThreshold = 9;
const logger = (logString: string, logLevel=0): void => {if (logLevel <= logThreshold) console.log ('TimeStamper: ' + logString)};
const version = '1.0.0-1000'

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
				const stamp = dateFormat(now, this.settings.timeStampFormat);
				editor.replaceSelection(stamp + '\n');
			}
		});

		this.addCommand({
			id: 'obsidian-fast-datestamp',
			name: 'Insert preconfigured date stamp',
			editorCallback: (editor) => {
				const now = new Date();
				const stamp = dateFormat(now, this.settings.dateStampFormat);
				editor.replaceSelection(stamp + '\n');
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
		formatComponent.setPlaceholder('e.g. yyyy-mm-dd');
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
			const stamp = dateFormat(now, stampFormat);
			editor.replaceSelection(stamp + '\n');
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
	}
}