/**
 * Virtual Agent Widget - Main Entry Point
 * Compiles to widget.js for embedding
 */

import Widget from './Widget.svelte';
import { mount } from 'svelte';
import './app.css';

interface WidgetConfig {
	embedUrl: string;
	position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
	primaryColor?: string;
	secondaryColor?: string;
	agentName?: string;
	botIconUrl?: string;
	size?: 'small' | 'medium' | 'large';
	enableMinimize?: boolean;
	enableSound?: boolean;
}

class VirtualAgentWidget {
	private widget: Widget | null = null;
	private config: WidgetConfig | null = null;

	init(config: WidgetConfig) {
		console.log('🔧 VirtualAgent.init called with config:', config);

		// Merge with defaults
		this.config = {
			position: 'bottom-right',
			primaryColor: '#007bff',
			agentName: 'Virtual Assistant',
			...config,
		};

		console.log('🔧 Merged config:', this.config);

		// Create widget container
		const container = document.createElement('div');
		container.id = 'virtual-agent-widget';
		document.body.appendChild(container);

		console.log('🔧 Container created, initializing Widget component...');

		// Initialize Svelte component
		// Svelte 5 API: mount(Component, { target, props })
		try {
			console.log('🔧 Props:', this.config);

			this.widget = mount(Widget, {
				target: container,
				props: this.config,
			}) as any;
			console.log('✅ Widget initialized successfully');
		} catch (error) {
			console.error('❌ Widget initialization failed:', error);
			console.error('❌ Error stack:', (error as Error).stack);
			throw error;
		}
	}

	open() {
		// TODO: Implement open widget
		console.log('Opening widget...');
	}

	close() {
		// TODO: Implement close widget
		console.log('Closing widget...');
	}

	toggle() {
		// TODO: Implement toggle widget
		console.log('Toggling widget...');
	}

	updateConfig(partialConfig: Partial<WidgetConfig>) {
		// TODO: Update widget config
		console.log('Updating config:', partialConfig);
	}

	destroy() {
		if (this.widget) {
			// Svelte 5 API: unmount() instead of $destroy()
			(this.widget as any).unmount?.();
			this.widget = null;
		}
	}
}

// Export global API
const VirtualAgent = new VirtualAgentWidget();
(window as any).VirtualAgent = VirtualAgent;

export default VirtualAgent;
