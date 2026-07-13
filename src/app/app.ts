import { ElementRef, ViewChild, AfterViewInit, Component, signal, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';


type hexagon = {
    center_x: number;
    center_y: number;
    radius: number; // also side length
    type: string; // desert, wood, brick, wheat, sheep, ore
    num: number; // die number
}


@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnDestroy {
    protected readonly title = signal('Catan-Tracker');

    @ViewChild('my_canvas') canvas_ref!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvas_container') container_ref!: ElementRef<HTMLDivElement>;

    private ctx!: CanvasRenderingContext2D;
    private resize_observer!: ResizeObserver;


    ngAfterViewInit(): void {
        this.ctx = this.canvas_ref.nativeElement.getContext('2d')!;

        this.resize_observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this.resize_canvas(width, height)
            }
        });

        this.resize_observer.observe(this.container_ref.nativeElement);
    }

    private resize_canvas(width: number, height: number): void {
        this.canvas_ref.nativeElement.width = width;
        this.canvas_ref.nativeElement.height = height;

        this.draw_board(width, height);
    }

    draw_board(width: number, height: number): void {
        let center_x: number = width / 2;
        let center_y: number = height / 2;
        let radius: number = Math.min(width, height) / 10;

        // Angle 0 starts at same place, but goes clockwise instead of counter clockwise
        // outer ring is 3 radii from center when angle % 60 != 0 
        // Otherwise, it's 4 * (radi / 2) * sqrt(3) = 2 * radi * sqrt(3)
        // next ring is same thing but only the 60 degree increments
        let outer_starting_angle: number = 0; // in degrees
        let dist_30: number = 3 * radius;
        let dist_60: number = 2 * radius * Math.sqrt(3);
        for (let i = 0; i < 12; i++) {
            let radians: number = outer_starting_angle * (Math.PI / 180);

            let temp_hex: hexagon = {
                center_x: outer_starting_angle % 60 == 0 ? center_x + dist_60 * Math.cos(radians) : center_x + dist_30 * Math.cos(radians),
                center_y: outer_starting_angle % 60 == 0 ? center_y + dist_60 * Math.sin(radians) : center_y + dist_30 * Math.sin(radians),
                radius: radius,
                type: i == 0 ? "wood" : "ore",
                num: radius,
            }

            this.draw_hexagon(temp_hex);

            outer_starting_angle -= 30;
            outer_starting_angle = outer_starting_angle % 360;
        }


        outer_starting_angle = 0;
        dist_60 = dist_60 / 2;
        for (let i = 0; i < 6; i++) {
            let radians: number = outer_starting_angle * (Math.PI / 180);
            let temp_hex: hexagon = {
                center_x: center_x + dist_60 * Math.cos(radians),
                center_y: center_y + dist_60 * Math.sin(radians),
                radius: radius,
                type: i == 0 ? "brick" : "wheat",
                num: -1,
            }
            this.draw_hexagon(temp_hex);

            outer_starting_angle -= 60;
            outer_starting_angle = outer_starting_angle % 360;
        }

        this.draw_hexagon({
            center_x: center_x,
            center_y: center_y,
            radius: radius,
            type: "sheep",
            num: 0
        });
    }

    draw_hexagon(hexagon: hexagon): void {
        this.ctx.lineWidth = hexagon['radius'] / 25;
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.moveTo(hexagon['center_x'], hexagon['center_y'] - hexagon['radius']);

        let angle: number = 30; // In degrees
        let prev_x: number = hexagon['center_x'];
        let prev_y: number = hexagon['center_y'] - hexagon['radius'];
        for (let i = 0; i < 6; i++) {
            const radians: number = angle * (Math.PI / 180);
            const next_x: number = prev_x + hexagon['radius'] * Math.cos(radians);
            const next_y: number = prev_y + hexagon['radius'] * Math.sin(radians);

            this.ctx.lineTo(next_x, next_y);
            prev_x = next_x;
            prev_y = next_y;
            angle += 60;
        }

        let color: string = "";
        switch (hexagon['type']) {
            case "wood":
                color = "#8c560f";
                break;
            case "brick":
                color = "#ce866d";
                break;
            case "wheat":
                color = "#e8b339";
                break;
            case "sheep":
                color = "#9fe21b";
                break;
            case "ore":
                color = "#a2c9bc";
                break;
            default:
                color = "#dabf6c";
        }

        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();


        // draw number
        if (hexagon['type'] != 'desert') {
            this.ctx.beginPath();
            this.ctx.moveTo(hexagon['center_x'], hexagon['center_y']);
            this.ctx.arc(hexagon['center_x'], hexagon['center_y'], hexagon['radius'] / 4, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#dabf6c';
            this.ctx.fill();
            this.ctx.closePath();


            this.ctx.fillStyle = 'black';
            this.ctx.font = `bold ${hexagon['radius'] / 6}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${hexagon['num']}`, hexagon['center_x'], hexagon['center_y']);
        }
    }

    ngOnDestroy(): void {
        if (this.resize_observer) {
            this.resize_observer.disconnect();
        }
    }
}


