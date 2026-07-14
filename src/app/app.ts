import { ElementRef, ViewChild, AfterViewInit, Component, signal, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';


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

    public outer_tiles: Hexagon[] = [];
    public inner_tiles: Hexagon[] = [];
    public center_tile!: Hexagon;
    private ctx!: CanvasRenderingContext2D;
    private resize_observer!: ResizeObserver;


    ngAfterViewInit(): void {
        this.initialize_tiles();
        this.ctx = this.canvas_ref.nativeElement.getContext('2d')!;

        this.resize_observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this.resize_canvas(width, height)
            }
        });

        this.resize_observer.observe(this.container_ref.nativeElement);
    }

    private initialize_tiles(): void {
        for (let i = 0; i < 12; i++) {
            this.outer_tiles.push(new Hexagon(0, 0, 0, "desert", -1));
        }

        for (let i = 0; i < 6; i++) {
            this.inner_tiles.push(new Hexagon(0, 0, 0, "desert", -1));
        }

        this.center_tile = new Hexagon(0, 0, 0, "desert", -1);
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
        for (let i = 0; i < this.outer_tiles.length; i++) {
            let radians: number = outer_starting_angle * (Math.PI / 180);

            this.outer_tiles[i].center_x = outer_starting_angle % 60 == 0 ? center_x + dist_60 * Math.cos(radians) : center_x + dist_30 * Math.cos(radians);
            this.outer_tiles[i].center_y = outer_starting_angle % 60 == 0 ? center_y + dist_60 * Math.sin(radians) : center_y + dist_30 * Math.sin(radians);
            this.outer_tiles[i].radius = radius;
            this.outer_tiles[i].type = i == 0 ? "wood" : "ore";
            this.outer_tiles[i].num = radius;

            this.outer_tiles[i].draw_hexagon(this.ctx);
            outer_starting_angle -= 30;
            outer_starting_angle = outer_starting_angle % 360;
        }


        outer_starting_angle = 0;
        dist_60 = dist_60 / 2;
        for (let i = 0; i < this.inner_tiles.length; i++) {
            let radians: number = outer_starting_angle * (Math.PI / 180);
            this.inner_tiles[i].center_x = center_x + dist_60 * Math.cos(radians);
            this.inner_tiles[i].center_y = center_y + dist_60 * Math.sin(radians);
            this.inner_tiles[i].radius = radius;
            this.inner_tiles[i].type = i == 0 ? "brick" : "wheat";
            this.inner_tiles[i].num = -1;

            this.inner_tiles[i].draw_hexagon(this.ctx);
            outer_starting_angle -= 60;
            outer_starting_angle = outer_starting_angle % 360;
        }

        this.center_tile.center_x = center_x;
        this.center_tile.center_y = center_y;
        this.center_tile.radius = radius;
        this.center_tile.type = "sheep";
        this.center_tile.num = 0;
        this.center_tile.draw_hexagon(this.ctx);
    }


    ngOnDestroy(): void {
        if (this.resize_observer) {
            this.resize_observer.disconnect();
        }
    }
}

class Hexagon {
    center_x: number;
    center_y: number;
    radius: number; // also side length
    type: string; // desert, wood, brick, wheat, sheep, ore
    num: number; // die number
    is_robbed: boolean;


    constructor(center_x: number, center_y: number, radius: number, type: string, num: number) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.radius = radius;
        this.type = type;
        this.num = num;
        this.is_robbed = false;
    }


    draw_hexagon(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.radius / 25;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(this.center_x, this.center_y - this.radius);

        let angle: number = 30; // In degrees
        let prev_x: number = this.center_x;
        let prev_y: number = this.center_y - this.radius;
        for (let i = 0; i < 6; i++) {
            const radians: number = angle * (Math.PI / 180);
            const next_x: number = prev_x + this.radius * Math.cos(radians);
            const next_y: number = prev_y + this.radius * Math.sin(radians);

            ctx.lineTo(next_x, next_y);
            prev_x = next_x;
            prev_y = next_y;
            angle += 60;
        }

        let color: string = "";
        switch (this.type) {
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

        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();


        // draw number
        if (this.type != 'desert') {
            ctx.beginPath();
            ctx.moveTo(this.center_x, this.center_y);
            ctx.arc(this.center_x, this.center_y, this.radius / 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#dabf6c';
            ctx.fill();
            ctx.closePath();


            ctx.fillStyle = 'black';
            ctx.font = `bold ${this.radius / 6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${this.num}`, this.center_x, this.center_y);
        }
    }

}

