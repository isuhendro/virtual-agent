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
	private widget: any = null;
	private config: WidgetConfig | null = null;
	private container: HTMLElement | null = null;

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
		this.container = document.createElement('div');
		this.container.id = 'virtual-agent-widget';
		document.body.appendChild(this.container);

		console.log('🔧 Container created, initializing Widget component...');

		// Initialize Svelte component
		// Svelte 5 API: mount(Component, { target, props })
		try {
			console.log('🔧 Props:', this.config);

			this.widget = mount(Widget, {
				target: this.container,
				props: this.config,
			});

			console.log('✅ Widget initialized successfully');
		} catch (error) {
			console.error('❌ Widget initialization failed:', error);
			console.error('❌ Error stack:', (error as Error).stack);
			throw error;
		}
	}

	open() {
		console.log('Opening widget...');
		if (this.widget && this.config) {
			this.remount({ ...this.config, isOpen: true });
		}
	}

	close() {
		console.log('Closing widget...');
		if (this.widget && this.config) {
			this.remount({ ...this.config, isOpen: false });
		}
	}

	toggle() {
		console.log('Toggling widget...');
		// We don't have a way to get current state, so just use open for now
		this.open();
	}

	private remount(newConfig: any) {
		if (!this.container) return;

		// Unmount existing widget
		(this.widget as any).unmount?.();

		// Clear container
		this.container.innerHTML = '';

		// Remount with new config
		this.widget = mount(Widget, {
			target: this.container,
			props: newConfig,
		});
	}

	updateConfig(partialConfig: Partial<WidgetConfig>) {
		console.log('Updating config:', partialConfig);

		if (!this.config || !this.widget) {
			console.error('Widget not initialized');
			return;
		}

		// Update stored config
		this.config = { ...this.config, ...partialConfig };

		// Remount with new config
		this.remount(this.config);

		console.log('✅ Config updated:', this.config);
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
